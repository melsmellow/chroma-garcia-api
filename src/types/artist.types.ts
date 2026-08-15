export interface ArtistSocial {
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface Artist {
  slug: string;
  name: string;
  artStyle: string;
  medium: string;
  bio: string;
  palette: string[];
  social?: ArtistSocial;
  portraitUrl?: string;
}