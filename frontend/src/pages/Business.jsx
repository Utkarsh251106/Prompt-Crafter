import { useState, useEffect } from "react";
import "../styles/business.css";

export default function Business() {

    const categories = [
        "Retail","Advertising & Marketing","Manufacturing","Real Estate Services","Construction",
        "Finance & Insurance","Computer & Programming","Legal & Accounting","Training & Coaching",
        "Transport & Shipping","Health & Wellness","Art & Entertainment","Food & Beverage",
        "Event & Business Service","Consulting","Architecture & Engineering","Employment Activities",
        "Car & Motorcycle","Personal Services","Security & Investigation","Travel","Telecommunications",
        "Sports & Leisure","Repair","Agriculture","Organizations & Others","Animals","Trades",
        "Others"
    ];

    const imageStyles = [
        "Professional","Modern","Minimalistic","Elegant","Bold & Vibrant",
        "Clean & Simple","Luxury","Playful","Corporate","Dark Theme","Light Theme"
    ];

    const [form, setForm] = useState({
        name: "",
        category: "",
        customCategory: "",
        subCategory: "",
        persona: "",
        imageType: "",
        imageStyle: "",

        // SECTION 2 — BEFORE
        beforePersona: "",
        beforeProblem: "",
        beforeEmotion: "",
        beforeEnvironment: "",
        beforeText: "",

        // SECTION 2 — AFTER
        afterPersona: "",
        afterSupport: "",
        afterOutcome: "",
        afterEmotion: "",
        afterText: ""
    });

    const [result, setResult] = useState("");
    const [canGenerate, setCanGenerate] = useState(false);

    useEffect(() => {
        const filled =
            form.name &&
            form.subCategory &&
            form.persona &&
            form.imageType &&
            form.imageStyle &&
            form.category &&
            (form.category !== "Others" || form.customCategory.trim() !== "");

        setCanGenerate(filled);
    }, [form]);

    const updateField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    async function generate() {
        setResult("Generating...");

        const finalCategory =
            form.category === "Others" ? form.customCategory : form.category;

        const res = await fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                category: finalCategory
            })
        });

        const data = await res.json();
        setResult(data.success ? data.output : "Error generating output");
    }

    return (
        <div className="business-page">

            <header className="business-header">
                <h1>AI Prompt Generator</h1>
                <p>Turn business details into powerful AI prompts.</p>
            </header>

            <div className="layout">

                {/* LEFT FORM */}
                <div className="form-column">

                    {/* SECTION 1 */}
                    <h2 className="section-title">Business Details</h2>

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
                        <>
                            <label>Custom Category</label>
                            <input
                                name="customCategory"
                                value={form.customCategory}
                                onChange={updateField}
                                placeholder="Enter custom category"
                            />
                        </>
                    )}

                    <label>Sub-Category / Service Type</label>
                    <input
                        name="subCategory"
                        value={form.subCategory}
                        onChange={updateField}
                    />

                    <label>Target Audience Persona</label>
                    <input
                        name="persona"
                        value={form.persona}
                        onChange={updateField}
                    />

                    <label>Image Type</label>
                    <input
                        name="imageType"
                        value={form.imageType}
                        onChange={updateField}
                    />

                    <label>Image Style</label>
                    <select
                        name="imageStyle"
                        value={form.imageStyle}
                        onChange={updateField}
                    >
                        <option value="">Select Image Style</option>
                        {imageStyles.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    {/* SECTION 2 */}
                    <h2 className="section-title">Before / After Framework</h2>

                    {/* BEFORE */}
                    <h3 className="sub-title">Before</h3>

                    <label>Audience Persona (Before)</label>
                    <input name="beforePersona" value={form.beforePersona} onChange={updateField} />

                    <label>Main Problem (Before)</label>
                    <input name="beforeProblem" value={form.beforeProblem} onChange={updateField} />

                    <label>Emotional State (Before)</label>
                    <input name="beforeEmotion" value={form.beforeEmotion} onChange={updateField} />

                    <label>Environment / Situation (Before)</label>
                    <input name="beforeEnvironment" value={form.beforeEnvironment} onChange={updateField} />

                    <label>Text on Image (Before)</label>
                    <input name="beforeText" value={form.beforeText} onChange={updateField} />

                    {/* AFTER */}
                    <h3 className="sub-title">After</h3>

                    <label>Audience Persona (After)</label>
                    <input name="afterPersona" value={form.afterPersona} onChange={updateField} />

                    <label>Support Used</label>
                    <input name="afterSupport" value={form.afterSupport} onChange={updateField} />

                    <label>Results / Outcomes</label>
                    <input name="afterOutcome" value={form.afterOutcome} onChange={updateField} />

                    <label>Emotional State (After)</label>
                    <input name="afterEmotion" value={form.afterEmotion} onChange={updateField} />

                    <label>Text on Image (After)</label>
                    <input name="afterText" value={form.afterText} onChange={updateField} />

                    <button
                        disabled={!canGenerate}
                        onClick={generate}
                        className="generate-btn"
                    >
                        Generate
                    </button>
                </div>

                {/* OUTPUT */}
                <div className="output-column">
                    <label className="output-title">Generated Prompt</label>

                    <textarea value={result} readOnly />

                    <div className="action-row">
                        <button className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(result)}
                        >
                            Copy
                        </button>

                        <button className="edit-btn">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
