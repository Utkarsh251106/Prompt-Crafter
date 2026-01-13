import { useState, useEffect } from "react";
import "../styles/business.css";

const categories = [
    "Retail","Advertising & Marketing","Manufacturing","Real Estate Services","Construction",
    "Finance & Insurance","Computer & Programming","Legal & Accounting","Training & Coaching",
    "Transport & Shipping","Health & Wellness","Art & Entertainment","Food & Beverage",
    "Event & Business Service","Consulting","Architecture & Engineering","Employment Activities",
    "Car & Motorcycle","Personal Services","Security & Investigation","Travel","Telecommunications",
    "Sports & Leisure","Repair","Agriculture","Organizations & Others","Animals","Trades",
    "Others"
];

export default function Business() {
    const [form, setForm] = useState({
        name: "",
        category: "",
        otherCategory: "",
        subCategory: "",
        persona: "",
        imageType: "",
    });

    const [result, setResult] = useState("");
    const [canGenerate, setCanGenerate] = useState(false);

    useEffect(() => {
        const valid =
            form.name &&
            (form.category !== "Others" ? form.category : form.otherCategory) &&
            form.subCategory &&
            form.persona &&
            form.imageType;

        setCanGenerate(valid);
    }, [form]);

    function updateField(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function generate() {
        setResult("Generating...");

        const finalCategory =
            form.category === "Others" ? form.otherCategory : form.category;

        const res = await fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name,
                category: finalCategory,
                subCategory: form.subCategory,
                persona: form.persona,
                imageType: form.imageType,
            }),
        });

        const data = await res.json();
        setResult(data.success ? data.output : "Error generating!");
    }

    return (
        <div className="business-container">
            {/* LEFT SECTION */}
            <div className="card form-card">
                <h2>Business Details</h2>

                <label>Business Name</label>
                <input name="name" value={form.name} onChange={updateField} />

                <label>Business Category</label>
                <select name="category" value={form.category} onChange={updateField}>
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                {form.category === "Others" && (
                    <input
                        name="otherCategory"
                        placeholder="Enter your custom category"
                        value={form.otherCategory}
                        onChange={updateField}
                    />
                )}

                <label>Sub-Category / Service Type</label>
                <input
                    name="subCategory"
                    value={form.subCategory}
                    onChange={updateField}
                />

                <label>Target Audience Persona</label>
                <input name="persona" value={form.persona} onChange={updateField} />

                <label>Image Type</label>
                <input name="imageType" value={form.imageType} onChange={updateField} />

                <button disabled={!canGenerate} onClick={generate}>
                    Generate
                </button>

                <button
                    onClick={() => {
                        localStorage.removeItem("loggedIn");
                        window.location.href = "/";
                    }}
                >
                    Logout
                </button>
            </div>

            {/* RIGHT SECTION */}
            <div className="card output-card">
                <h2>Generated Prompt</h2>
                <textarea value={result} readOnly></textarea>

                <button
                    onClick={() => {
                        navigator.clipboard.writeText(result);
                        alert("Copied!");
                    }}
                >
                    Copy
                </button>
            </div>
        </div>
    );
}
