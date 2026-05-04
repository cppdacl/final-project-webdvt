import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Recipe } from "../types/Recipe";
import {
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
} from "../api/recipes";

type FormState = {
    name: string;
    description: string;
    ingredients: string;
    instructions: string;
};

const EMPTY_FORM: FormState = {
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
};

export default function Manage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editingId = id ?? null;

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [sidebarSearch, setSidebarSearch] = useState("");
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [dragging, setDragging] = useState(false);
    const [errors, setErrors] = useState<Partial<FormState & { image: string }>>({});
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [loadingForm, setLoadingForm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchRecipes().then(setRecipes).catch(() => { });
    }, []);

    useEffect(() => {
        if (!editingId) {
            setForm(EMPTY_FORM);
            setImageFile(null);
            setImagePreview("");
            setErrors({});
            setFeedback("");
            return;
        }
        setLoadingForm(true);
        fetchRecipe(editingId)
            .then((r: Recipe) => {
                setForm({
                    name: r.name,
                    description: r.description,
                    ingredients: r.ingredients.join("\n"),
                    instructions: r.instructions.join("\n"),
                });
                setImagePreview(r.image || "");
                setImageFile(null);
                setErrors({});
                setFeedback("");
            })
            .catch(() => navigate("/manage"))
            .finally(() => setLoadingForm(false));
    }, [editingId]);

    const applyFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, image: undefined }));
    };

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) applyFile(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const onDragLeave = () => setDragging(false);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) applyFile(file);
    };

    const validate = () => {
        const errs: Partial<FormState & { image: string }> = {};
        if (!form.name.trim()) errs.name = "Name is required.";
        if (!form.description.trim()) errs.description = "Description is required.";
        if (!form.ingredients.trim()) errs.ingredients = "At least one ingredient is required.";
        if (!form.instructions.trim()) errs.instructions = "At least one instruction step is required.";
        if (!editingId && !imageFile) errs.image = "An image is required.";
        return errs;
    };

    const onSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        const data = new FormData();
        data.append("name", form.name.trim());
        data.append("description", form.description.trim());
        data.append(
            "ingredients",
            JSON.stringify(form.ingredients.split("\n").map((s) => s.trim()).filter(Boolean))
        );
        data.append(
            "instructions",
            JSON.stringify(form.instructions.split("\n").map((s) => s.trim()).filter(Boolean))
        );
        if (imageFile) data.append("image", imageFile);

        setSubmitting(true);
        setFeedback("");

        try {
            if (editingId) {
                const updated: Recipe = await updateRecipe(editingId, data);
                setRecipes((prev) => prev.map((r) => (r._id === editingId ? updated : r)));
                setFeedback("Recipe updated successfully.");
                setImageFile(null);
            } else {
                const created: Recipe = await createRecipe(data);
                setRecipes((prev) => [...prev, created]);
                setForm(EMPTY_FORM);
                setImageFile(null);
                setImagePreview("");
                if (fileInputRef.current) fileInputRef.current.value = "";
                setFeedback("Recipe created successfully.");
                navigate(`/manage/${created._id}`);
            }
        } catch (e: any) {
            setFeedback(e.message ?? "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const onDelete = async (recipeId: string) => {
        if (!confirm("Delete this recipe?")) return;
        try {
            await deleteRecipe(recipeId);
            setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
            if (editingId === recipeId) navigate("/manage");
        } catch {
            setFeedback("Failed to delete recipe.");
        }
    };

    const field = (key: keyof FormState) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({ ...prev, [key]: e.target.value }));
            setErrors((prev) => ({ ...prev, [key]: undefined }));
        },
    });

    const filteredRecipes = recipes.filter((r) =>
        r.name.toLowerCase().includes(sidebarSearch.toLowerCase())
    );

    return (
        <div className="manage-layout">
            <aside className="manage-sidebar">
                <div className="sidebar-header">
                    <button
                        className="manage-btn-add"
                        onClick={() => navigate("/")}
                        title="Go back"
                    >
                        ←
                    </button>
                    <span>Recipes</span>
                    <button
                        className="manage-btn-add"
                        onClick={() => navigate("/manage")}
                        title="Add new recipe"
                    >
                        +
                    </button>
                </div>
                <div className="sidebar-search-wrapper">
                    <input
                        className="sidebar-search-input"
                        type="text"
                        placeholder="Search..."
                        value={sidebarSearch}
                        onChange={(e) => setSidebarSearch(e.target.value)}
                    />
                </div>
                <ul className="recipe-list">
                    {filteredRecipes.map((r) => (
                        <li
                            key={r._id}
                            className={`recipe-list-item ${editingId === r._id ? "active" : ""}`}
                        >
                            <span onClick={() => navigate(`/manage/${r._id}`)}>{r.name}</span>
                            <button
                                className="delete-btn"
                                onClick={() => onDelete(r._id)}
                                title="Delete"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="manage-form-area">
                <h2>{editingId ? "Edit Recipe" : "New Recipe"}</h2>

                {loadingForm ? (
                    <p className="empty-text">Loading...</p>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Name</label>
                            <input className={`manage-input ${errors.name ? "input-error" : ""}`} {...field("name")} placeholder="Chicken Adobo" />
                            {errors.name && <span className="error-msg">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea className={`manage-input ${errors.description ? "input-error" : ""}`} rows={2} {...field("description")} placeholder="A short description..." />
                            {errors.description && <span className="error-msg">{errors.description}</span>}
                        </div>

                        <div className="form-group">
                            <label>Ingredients <small>(one per line)</small></label>
                            <textarea className={`manage-input ${errors.ingredients ? "input-error" : ""}`} rows={5} {...field("ingredients")} placeholder={"1 kg chicken\n1/2 cup soy sauce"} />
                            {errors.ingredients && <span className="error-msg">{errors.ingredients}</span>}
                        </div>

                        <div className="form-group">
                            <label>Instructions <small>(one step per line)</small></label>
                            <textarea className={`manage-input ${errors.instructions ? "input-error" : ""}`} rows={5} {...field("instructions")} placeholder={"Marinate chicken for 30 minutes.\nSimmer until tender."} />
                            {errors.instructions && <span className="error-msg">{errors.instructions}</span>}
                        </div>

                        <div className="form-group">
                            <label>Image {!editingId && <span className="required-star">*</span>}</label>
                            {imagePreview && (
                                <img className="image-preview" src={imagePreview} alt="Preview" />
                            )}
                            <div
                                className={`image-upload-area ${dragging ? "dragging" : ""} ${errors.image ? "input-error" : ""}`}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={onImageChange}
                                />
                                <div className="upload-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                        />
                                    </svg>
                                </div>
                                <p className="upload-label">
                                    {dragging ? "Drop it!" : <><span>Click to upload</span> or drag & drop</>}
                                </p>
                                <p className="upload-sub">PNG, JPG, WEBP up to 10MB</p>
                            </div>
                            {errors.image && <span className="error-msg">{errors.image}</span>}
                        </div>

                        {feedback && (
                            <p className={`feedback-msg ${feedback.includes("success") ? "feedback-ok" : "feedback-err"}`}>
                                {feedback}
                            </p>
                        )}

                        <div className="form-actions">
                            <button className="manage-btn" onClick={onSubmit} disabled={submitting}>
                                {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Recipe"}
                            </button>
                            {editingId && (
                                <button className="manage-btn danger" onClick={() => onDelete(editingId)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}