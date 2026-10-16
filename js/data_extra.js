const extraSymbols = {
    "هود": { letter: "ه", interpretations: {
        "ibn-sirin": "هود عليه السلام بشرى بالنجاة بعد شدة.",
        "nabulsi": "هود عليه السلام رمز نجاة بعد الضيق.",
        "ibn-shahin": "هود عليه السلام دلالة فرج.",
        "jafar": "هود عليه السلام شارة بفرج."
    }},
    "نبق": { letter: "ن", interpretations: {
        "ibn-sirin": "النبق يدل على رزق من العراق.",
        "nabulsi": "النبق يدل على رزق حلال.",
        "ibn-shahin": "النبق دلالة خير.",
        "jafar": "النبق شارة بالصلاح."
    }},
    "زكريا": { letter: "ز", interpretations: {
        "ibn-sirin": "زكريا عليه السلام رزق ولد على كبر.",
        "nabulsi": "زكريا عليه السلام بشرى بالولد.",
        "ibn-shahin": "زكريا دلالة فرج.",
        "jafar": "زكريا شارة بالولد."
    }},
    "يحيى": { letter: "ي", interpretations: {
        "ibn-sirin": "يحيى عليه السلام بشرى بالورع.",
        "nabulsi": "يحيى عليه السلام رمز حياة.",
        "ibn-shahin": "يحيى دلالة بشرى.",
        "jafar": "يحيى شارة بشرى."
    }}
};
if (typeof dreamDatabase !== "undefined") {
    try { Object.assign(dreamDatabase, extraSymbols); } catch (e) {}
}