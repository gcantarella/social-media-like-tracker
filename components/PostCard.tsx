import React, { useMemo } from 'react';
import { Post, SocialPlatform, UserRole } from '../types';
import { CalendarIcon, HeartIcon, CommentIcon, MinusIcon, ResetIcon, EditIcon, TrashIcon } from './Icons';

interface PostCardProps {
    post: Post;
    onUpdate: (post: Post) => void;
    onEdit: (post: Post) => void;
    onDelete: (post: Post) => void;
    platform: SocialPlatform;
    userRole: UserRole;
}

const platformBorderColors: Record<SocialPlatform, string> = {
    [SocialPlatform.Facebook]: 'border-blue-500',
    [SocialPlatform.Instagram]: 'border-pink-500',
    [SocialPlatform.TikTok]: 'border-black',
    [SocialPlatform.LinkedIn]: 'border-sky-600',
    [SocialPlatform.X]: 'border-gray-500',
};


const PostCard: React.FC<PostCardProps> = ({ post, onUpdate, onEdit, onDelete, platform, userRole }) => {

    const handleCommentClick = () => {
        onUpdate({ ...post, totalComments: post.totalComments + 1 });
    };

    const handleLikeClick = () => {
        onUpdate({
            ...post,
            moderatorLikes: post.moderatorLikes + 1,
        });
    };

    const handleDecrementComment = () => {
        onUpdate({ ...post, totalComments: Math.max(0, post.totalComments - 1) });
    };

    const handleDecrementLike = () => {
        onUpdate({ ...post, moderatorLikes: Math.max(0, post.moderatorLikes - 1) });
    };
    
    const handleResetCounters = () => {
        if (window.confirm('Sei sicuro di voler azzerare i contatori per questo post?')) {
            onUpdate({ ...post, totalComments: 0, moderatorLikes: 0 });
        }
    };

    const { likesByRule, commentsForNextLike, progressPercentage, isLikeTime } = useMemo(() => {
        if (post.totalComments <= 0) {
            return {
                likesByRule: 0,
                commentsForNextLike: 3,
                progressPercentage: 0,
                isLikeTime: false
            };
        }
        
        const calculatedLikes = Math.floor((post.totalComments - 1) / 3) + 1;
        const remainder = (post.totalComments - 1) % 3;
        const calculatedCommentsForNextLike = 3 - remainder;
        const calculatedProgress = (remainder / 3) * 100;
        const calculatedIsLikeTime = remainder === 0;

        return {
            likesByRule: calculatedLikes,
            commentsForNextLike: calculatedCommentsForNextLike,
            progressPercentage: calculatedProgress,
            isLikeTime: calculatedIsLikeTime
        };
    }, [post.totalComments]);

    const formattedDate = new Date(post.date).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden border-t-4 ${platformBorderColors[platform]} flex flex-col transition-transform duration-300 hover:scale-105 hover:z-10 relative`}>
            {post.imageUrl && (
                <img src={post.imageUrl} alt={post.description} className="w-full object-cover" />
            )}

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                     <p className="text-gray-700 leading-relaxed mb-4">{post.description}</p>
                     <div className="flex items-center text-gray-500 text-sm mb-4">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>{formattedDate}</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Contatori</h4>
                    
                    <div className="flex justify-around items-center text-center mb-4">
                        {/* Commenti Inseriti */}
                        <div className="relative">
                            <span className="text-xs font-medium text-gray-500 block">Commenti Inseriti</span>
                            <button onClick={handleCommentClick} className="flex items-center justify-center text-xl font-bold text-sky-500 group focus:outline-none px-4" aria-label="Aggiungi un commento">
                                <CommentIcon className="w-6 h-6 mr-1 transition-colors duration-200 text-sky-500 group-hover:text-sky-400" />
                                {post.totalComments}
                            </button>
                             {userRole === UserRole.Admin && post.totalComments > 0 && (
                                <button
                                    onClick={handleDecrementComment}
                                    className="absolute -right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                                    aria-label="Rimuovi un commento"
                                >
                                    <MinusIcon className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                        {/* Likes Inseriti */}
                        <div className="relative">
                            <span className="text-xs font-medium text-gray-500 block">Like Inseriti</span>
                            <button onClick={handleLikeClick} className="flex items-center justify-center text-xl font-bold text-red-500 group focus:outline-none px-4" aria-label="Aggiungi un like">
                                <HeartIcon className={`w-6 h-6 mr-1 transition-colors duration-200 ${post.moderatorLikes > 0 ? 'text-red-500' : 'text-gray-400'} group-hover:text-red-400`} />
                                {post.moderatorLikes}
                            </button>
                             {userRole === UserRole.Admin && post.moderatorLikes > 0 && (
                                <button
                                    onClick={handleDecrementLike}
                                    className="absolute -right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                                    aria-label="Rimuovi un like"
                                >
                                    <MinusIcon className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg p-3 space-y-3">
                        <div className="text-center">
                             <span className="text-xs font-medium text-gray-500 block">Like da Regola (1/3)</span>
                             <span className="text-xl font-bold text-gray-800 flex items-center justify-center">
                                {likesByRule}
                            </span>
                        </div>
                        
                        {isLikeTime ? (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-3 rounded-md text-center animate-pulse" role="alert">
                                <p className="font-bold">È il momento del Like!</p>
                                <p className="text-sm">Hai raggiunto il {post.totalComments}° commento. Ottimo lavoro!</p>
                            </div>
                        ) : (
                             <div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5" aria-hidden="true">
                                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                                <p className="text-right text-xs text-gray-500 mt-1" aria-live="polite">
                                    {commentsForNextLike} {commentsForNextLike === 1 ? 'commento' : 'commenti'} per il prossimo like
                                </p>
                             </div>
                        )}
                    </div>

                </div>
            </div>
            
            {userRole === UserRole.Admin && (
                <div className="absolute top-3 right-3 flex items-center gap-1 z-30">
                     <button
                        onClick={() => onDelete(post)}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-red-500 hover:text-white transition-colors duration-200"
                        aria-label="Delete post"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit(post)}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-yellow-500 hover:text-white transition-colors duration-200"
                        aria-label="Edit post"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    {(post.totalComments > 0 || post.moderatorLikes > 0) && (
                        <button
                            onClick={handleResetCounters}
                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200"
                            aria-label="Reset counters"
                        >
                            <ResetIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;