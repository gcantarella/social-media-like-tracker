import React, { useState, useMemo, useEffect } from 'react';
import { SocialPlatform, Post, UserRole } from './types';
import SocialTabs from './components/SocialTabs';
import PostCard from './components/PostCard';
import AddPostForm from './components/AddPostForm';
import { PlusIcon, InfoIcon } from './components/Icons';
import RoleSwitcher from './components/RoleSwitcher';
import RulesModal from './components/RulesModal';
import ConfirmationModal from './components/ConfirmationModal';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

const App: React.FC = () => {
    const [postsByPlatform, setPostsByPlatform] = useState<Record<SocialPlatform, Post[]>>({
        [SocialPlatform.Facebook]: [],
        [SocialPlatform.Instagram]: [],
        [SocialPlatform.TikTok]: [],
        [SocialPlatform.LinkedIn]: [],
        [SocialPlatform.X]: [],
    });
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

    useEffect(() => {
        const q = query(collection(db, "posts"), where("platform", "==", activePlatform));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const posts: Post[] = [];
            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() } as Post);
            });
            setPostsByPlatform(prev => ({ ...prev, [activePlatform]: posts }));
            console.log("Data successfully synchronized for all users.");
        }, (error) => {
            console.error("Error fetching posts: ", error);
            console.log("Failed to synchronize data. Please check the console for errors.");
        });

        return () => unsubscribe();
    }, [activePlatform]);

    const activePosts = useMemo(() => postsByPlatform[activePlatform], [postsByPlatform, activePlatform]);

    const handleAddPost = async (newPost: Omit<Post, 'id'>) => {
        try {
            await addDoc(collection(db, "posts"), { ...newPost, platform: activePlatform });
            setPostFormOpen(false);
            console.log("Post added and synchronized for all users.");
        } catch (error) {
            console.error("Error adding post: ", error);
            console.log("Failed to synchronize data. Please check the console for errors.");
        }
    };

    const handleUpdatePost = async (updatedPost: Post) => {
        try {
            const postRef = doc(db, "posts", updatedPost.id);
            await updateDoc(postRef, { ...updatedPost });
            console.log("Post updated and synchronized for all users.");
        } catch (error) {
            console.error("Error updating post: ", error);
             console.log("Failed to synchronize data. Please check the console for errors.");
        }
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
    
    const handleDeletePost = async () => {
        if (!postToDelete) return;
        try {
            const postRef = doc(db, "posts", postToDelete.id);
            await deleteDoc(postRef);
            handleCloseDeleteConfirm();
            console.log("Post deleted and synchronized for all users.");
        } catch (error) {
            console.error("Error deleting post: ", error);
            console.log("Failed to synchronize data. Please check the console for errors.");
        }
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
