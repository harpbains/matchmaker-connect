
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Basic Info
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'other')),
    bio TEXT DEFAULT '',
    
    -- Location
    city TEXT DEFAULT '',
    country TEXT DEFAULT '',
    
    -- Cultural Info
    religion TEXT DEFAULT '',
    mother_tongue TEXT DEFAULT '',
    languages TEXT[] DEFAULT '{}',
    dietary_preference TEXT DEFAULT '',
    
    -- Professional Info
    education TEXT DEFAULT '',
    profession TEXT DEFAULT '',
    
    -- Physical
    height_cm INTEGER,
    
    -- Immigration
    visa_status TEXT DEFAULT '',
    
    -- App preferences
    looking_for TEXT CHECK (looking_for IN ('casual', 'matrimony', 'both')) DEFAULT 'both',
    
    -- Photos (array of storage URLs)
    photos TEXT[] DEFAULT '{}',
    
    -- Profile completion
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    
    -- Verification
    is_verified BOOLEAN NOT NULL DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can do everything on profiles
CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id) VALUES (NEW.id);
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create profile photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Storage policies for profile photos
CREATE POLICY "Profile photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
