import React, { useState, useMemo, useEffect } from 'react';
import { SocialPlatform, Post, UserRole } from './types';
import SocialTabs from './components/SocialTabs';
import PostCard from './components/PostCard';
import AddPostForm from './components/AddPostForm';
import { PlusIcon, InfoIcon } from './components/Icons';
import RoleSwitcher from './components/RoleSwitcher';
import RulesModal from './components/RulesModal';
import ConfirmationModal from './components/ConfirmationModal';

const initialPosts: Record<SocialPlatform, Post[]> = {
    [SocialPlatform.Facebook]: [
        { id: 'fb0', imageUrl: null, description: 'ddd', date: '2025-08-29', totalComments: 0, moderatorLikes: 0 },
        { id: 'fb1', imageUrl: 'https://picsum.photos/seed/fb1/500/300', description: 'Grande successo per il nostro ultimo evento a Milano! Grazie a tutti per aver partecipato.', date: '2025-08-26', totalComments: 17, moderatorLikes: 5 },
        { id: 'fb2', imageUrl: 'https://picsum.photos/seed/fb2/500/300', description: 'Avviso importante: i nostri uffici rimarranno chiusi per ferie dal 10 al 20 Settembre.', date: '2025-08-25', totalComments: 8, moderatorLikes: 3 },
    ],
    [SocialPlatform.Instagram]: [
        { id: 'ig1', imageUrl: 'https://picsum.photos/seed/ig1/500/500', description: 'Dietro le quinte del nostro ultimo shooting fotografico. Presto grandi novità!', date: '2025-08-27', totalComments: 142, moderatorLikes: 47 },
    ],
    [SocialPlatform.TikTok]: [],
    [SocialPlatform.LinkedIn]: [
        { id: 'li1', imageUrl: 'https://picsum.photos/seed/li1/600/314', description: 'Siamo lieti di annunciare la nostra nuova partnership strategica. Un grande passo per il futuro della nostra azienda.', date: '2025-08-24', totalComments: 56, moderatorLikes: 19 },
    ],
    [SocialPlatform.X]: [],
};


const App: React.FC = () => {
    const [postsByPlatform, setPostsByPlatform] = useState<Record<SocialPlatform, Post[]>>(initialPosts);
    const [activePlatform, setActivePlatform] = useState<SocialPlatform>(SocialPlatform.Facebook);
    const [isPostFormOpen, setPostFormOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState<Post | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(UserRole.Admin);
    const [isRulesModalOpen, setRulesModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedBefore');
        if (!hasVisited) {
            setRulesModalOpen(true);
            localStorage.setItem('hasVisitedBefore', 'true');
        }
    }, []);

    const activePosts = useMemo(() => postsByPlatform[activePlatform], [postsByPlatform, activePlatform]);

    const handleAddPost = (newPost: Omit<Post, 'id'>) => {
        setPostsByPlatform(prev => ({
            ...prev,
            [activePlatform]: [{ ...newPost, id: new Date().toISOString() }, ...prev[activePlatform]],
        }));
        setPostFormOpen(false);
    };

    const handleUpdatePost = (updatedPost: Post) => {
        setPostsByPlatform(prev => ({
            ...prev,
            [activePlatform]: prev[activePlatform].map(p => p.id === updatedPost.id ? updatedPost : p),
        }));
    };
    
    const handleUpdatePostFromForm = (updatedPost: Post) => {
        handleUpdatePost(updatedPost);
        setPostFormOpen(false);
        setPostToEdit(null);
    };

    const handleOpenEditForm = (post: Post) => {
        setPostToEdit(post);
        setPostFormOpen(true);
    };
    
    const handleCloseForm = () => {
        setPostFormOpen(false);
        setPostToEdit(null);
    };

    const handleOpenDeleteConfirm = (post: Post) => {
        setPostToDelete(post);
    };

    const handleCloseDeleteConfirm = () => {
        setPostToDelete(null);
    };
    
    const handleDeletePost = () => {
        if (!postToDelete) return;

        setPostsByPlatform(prev => ({
            ...prev,
            [activePlatform]: prev[activePlatform].filter(p => p.id !== postToDelete.id)
        }));
        handleCloseDeleteConfirm();
    };


    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <header className="max-w-7xl mx-auto mb-8">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-4">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">Social Like Dashboard</h1>
                        <button 
                            onClick={() => setRulesModalOpen(true)}
                            className="text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                            aria-label="Mostra regole per moderatori"
                        >
                            <InfoIcon className="w-7 h-7" />
                        </button>
                    </div>
                    <p className="mt-2 text-lg text-gray-600">Monitora e gestisci i like con la regola 1 like ogni 3 commenti.</p>
                </div>
                <RoleSwitcher userRole={userRole} onRoleChange={setUserRole} />
            </header>

            <main className="max-w-7xl mx-auto">
                <SocialTabs activePlatform={activePlatform} onPlatformChange={setActivePlatform} />

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Posts on {activePlatform}</h2>
                        {userRole === UserRole.Admin && (
                            <button
                                onClick={() => {
                                    setPostToEdit(null);
                                    setPostFormOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Add Post</span>
                            </button>
                        )}
                    </div>

                    {activePosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activePosts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onUpdate={handleUpdatePost}
                                    onEdit={handleOpenEditForm}
                                    onDelete={handleOpenDeleteConfirm}
                                    platform={activePlatform}
                                    userRole={userRole}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed border-gray-300">
                            <h3 className="text-xl font-medium text-gray-900">Nessun post trovato</h3>
                            <p className="text-gray-500 mt-2">Aggiungi il tuo primo post per {activePlatform}!</p>
                        </div>
                    )}
                </div>
            </main>

            {isPostFormOpen && (
                <AddPostForm
                    onClose={handleCloseForm}
                    onAddPost={handleAddPost}
                    onUpdatePost={handleUpdatePostFromForm}
                    postToEdit={postToEdit}
                />
            )}
            
            {isRulesModalOpen && (
                <RulesModal onClose={() => setRulesModalOpen(false)} />
            )}

            {postToDelete && (
                <ConfirmationModal
                    title="Conferma Eliminazione"
                    message={`Sei sicuro di voler eliminare definitivamente questo post? L'azione non è reversibile.`}
                    onConfirm={handleDeletePost}
                    onCancel={handleCloseDeleteConfirm}
                    confirmText="Elimina"
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};

export default App;
