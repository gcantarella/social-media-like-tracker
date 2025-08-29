import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { UploadIcon } from './Icons';

interface AddPostFormProps {
    onClose: () => void;
    onAddPost: (newPost: Omit<Post, 'id'>) => void;
    onUpdatePost: (post: Post) => void;
    postToEdit: Post | null;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onClose, onAddPost, onUpdatePost, postToEdit }) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string>('');

    const isEditing = !!postToEdit;

    useEffect(() => {
        if (isEditing) {
            setDescription(postToEdit.description);
            setDate(postToEdit.date);
            setImageUrl(postToEdit.imageUrl);
            setImageName(postToEdit.imageUrl ? 'Immagine corrente' : '');
        }
    }, [postToEdit, isEditing]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            onUpdatePost({
                ...postToEdit,
                description,
                date,
                imageUrl,
            });
        } else {
            onAddPost({ description, date, imageUrl, totalComments: 0, moderatorLikes: 0 });
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 relative transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Modifica Post' : 'Aggiungi Nuovo Post'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descrizione post</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            className="w-full bg-white text-gray-900 rounded-md px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full bg-white text-gray-900 rounded-md px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Card post (Immagine)</label>
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Preview" className="mx-auto h-24 w-auto rounded-md"/>
                                ) : (
                                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white focus-within:ring-indigo-500 px-2 py-1">
                                        <span>Carica un file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                                    </label>
                                    <p className="pl-1">o trascina qui</p>
                                </div>
                                <p className="text-xs text-gray-500">{imageName || 'PNG, JPG, GIF fino a 10MB'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center pt-2 space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Annulla</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">{isEditing ? 'Salva Modifiche' : 'Aggiungi Post'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPostForm;