export enum SocialPlatform {
    Facebook = 'Facebook',
    Instagram = 'Instagram',
    TikTok = 'TikTok',
    LinkedIn = 'LinkedIn',
    X = 'X'
}

export enum UserRole {
    Admin = 'Admin',
    Moderator = 'Moderator'
}

export interface Post {
    id: string;
    platform: SocialPlatform;
    imageUrl: string | null;
    description: string;
    date: string;
    totalComments: number;
    moderatorLikes: number;
}