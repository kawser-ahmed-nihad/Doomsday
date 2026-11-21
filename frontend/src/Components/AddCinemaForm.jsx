import { useEffect, useState } from "react";

export default function AddCinemaForm({ isOpen, onClose, onCreated }) {
    const [name, setName] = useState("");
    const [sizes, setSizes] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (e.key === "Escape" && !saving) onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, saving, onClose]);

    if (!isOpen) return null;

    async function submit(e) {
        e.preventDefault();
        setError("");

        const list = sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map(Number);

        if (!name.trim()) {
            return setError("Cinema name is required.");
        }

        if (list.length < 1 || list.length > 10) {
            return setError("Enter 1 to 10 bundle sizes.");
        }

        if (!list.every((n) => Number.isInteger(n) && n >= 1 && n <= 500)) {
            return setError("Each bundle size must be between 1 and 500.");
        }

        if (new Set(list).size !== list.length) {
            return setError("Bundle sizes must be different.");
        }

        setSaving(true);

        try {
            await createCinema({
                name: name.trim(),
                bundleSizes: list,
            });

            setName("");
            setSizes("");

            await onCreated();
            onClose();
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !saving) onClose();
            }}
        >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">

                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                            <Building2 size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-white">
                                Add New Cinema
                            </h2>
                            <p className="text-xs text-gray-500">
                                Enter cinema information
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={submit} className="space-y-5 p-5">

                    {error && <ErrorBox>{error}</ErrorBox>}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                            Cinema Name
                        </label>

                        <div className="relative">
                            <Building2
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Star Cineplex"
                                className="w-full rounded-xl border border-white/10 bg-[#0B1220] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                            Bundle Sizes
                        </label>

                        <div className="relative">
                            <Layers3
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                value={sizes}
                                onChange={(e) => setSizes(e.target.value)}
                                placeholder="e.g. 6, 9, 20"
                                className="w-full rounded-xl border border-white/10 bg-[#0B1220] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
                            />
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            Enter 1–10 different bundle sizes, separated by commas.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={17} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Plus size={17} />
                                    Add Cinema
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
