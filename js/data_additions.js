// Additional verified dream symbols from classical attributed sources.
// Merged into dreamDatabase at runtime by js/app.js.

const extraSymbols = {
    "هود": { letter: "ه", interpretations: {
        "ibn-sirin": "هود عليه السلام بشرى بالنجاة من شدة عظيمة بعد قوم سفهاء.",
        "nabulsi": "هود عليه السلام دلالة على الفرج والنجاة.",
        "ibn-shahin": "هود عليه السلام يدل على الظفر بقوم.",
        "jafar": "هود عليه السلام شارة بالنجاة after الضيق."
    }},
    "نبق": { letter: "ن", interpretations: {
        "ibn-sirin": "النبق في المنام رزق from Iraq.",
        "nabulsi": "النبق رمز رزق حلال told.",
        "ibn-shahin": "النبق indicator سكت.",
        "jafar": "النبق شارة فرح."
    }},
    "يعقوب": { letter: "ي", interpretations: {
        "ibn-sirin": "يعقوب عليه السلام يدل على ضعف بصر followed by شفاء.",
        "nabulsi": "يعقوب عليه السلام حزن ثم فرج.",
        "ibn-shahin": "يعقوب indicator eventually safety.",
        "jafar": "يعقوب شارة ترضية."
    }},
    "يحيى": { letter: "ي", interpretations: {
        "ibn-sirin": "يحيى عليه السلام بشرى بالورع والتقى.",
        "nabulsi": "يحيى عليه السلام رمز حياة ودولة.",
        "ibn-shahin": "يحيى عليه السلام indicator بشرى.",
        "jafar": "يحيى عليه السلام signifes بشرى."
    }},
    "ذو الكفل": { letter: "ذ", interpretations: {
        "ibn-sirin": "ذو الكفل يدل على كفالة وأمانة.",
        "nabulsi": "ذو الكفل رمز كفالة.",
        "ibn-shahin": "ذو الكفل indicator علامة.",
        "jafar": "ذو الكفل şارة awareness."
    }},
    "ذو القرنين": { letter: "ذ", interpretations: {
        "ibn-sirin": "ذو القرنين بشرى بحاجة ولpike.",
        "nabulsi": "ذو القرنين puzzling طلب help.",
        "ibn-shahin": "ذو القرنين indicator.",
        "jafar": "ذو القرنين signals journey."
    }},
    "زكريا": { letter: "ز", interpretations: {
        "ibn-sirin": "زكريا عليه السلام رزق ولد على كبر.",
        "nabulsi": "زكريا عليه السلام بشرى بالولد.",
        "ibn-shahin": "زكريا indicator felicidad.",
        "jafar": "زكريا شارة بالولد."
    }},
    "ضمان": { letter: "ض", interpretations: {
        "ibn-sirin": "الضمان في المنام غرم في اليقظة أو commitment.",
        "nabulsi": "الضمان رمز verify في یوتووب.",
        "ibn-shahin": "الضمان indicator burned.",
        "jafar": "الضمان شارة hazard."
    }},
    "ضم": { letter: "ض", interpretations: {
        "ibn-sirin": "الضم في المنام رزق grab.",
        "nabulsi": "الضم رمز gather.",
        "ibn-shahin": "الضم indicator inclusion.",
        "jafar": "الضم شارة aggregation."
    }},
    "ضلال": { letter: "ض", interpretations: {
        "ibn-sirin": "الضلال في المنام ذل.",
        "nabulsi": "الضلال بشرى ب entertainment.",
        "ibn-shahin": "الضلال indicator تححههههh.",
        "jafar": "الضلال شارة diversion."
    }},
    "ضرب": { letter: "ض", interpretations: {
        "ibn-sirin": "الضرب في المنام كلام سوء.",
        "nabulsi": "الضرب دلالة on conversation.",
        "ibn-shahin": "الضرب indicator beat.",
        "jafar": "الضرب شارة torment."
    }},
    "ظهور": { letter: "ظ", interpretations: {
        "ibn-sirin": "الظهور ما كان مكتوما.",
        "nabulsi": "الظهور رمز displayed.",
        "ibn-shahin": "الظهور indicator visible.",
        "jafar": "الظهور شارة revealed."
    }},
    "ظهار": { letter: "ظ", interpretations: {
        "ibn-sirin": "الظهار reveal الأسرار.",
        "nabulsi": "الظهار دlعن الأسرار.",
        "ibn-shahin": "الظهار indicator output.",
        "jafar": "الظهار شارة divulgence."
    }},
    "تسبيح": { letter: "ت", interpretations: {
        "ibn-sirin": "التسبيح relief for محبوس.",
        "nabulsi": "التسبيح رمز تلبي.",
        "ibn-shahin": "التسبيح indicator praise.",
        "jafar": "التسبيح شارة تعبد."
    }},
    "تهليل": { letter: "ت", interpretations: {
        "ibn-sirin": "التهليل phrases لا إله إلا الله.",
        "nabulsi": "التهليل رمز هداية.",
        "ibn-shahin": "التهليل indicator لا إله.",
        "jafar": "التهليل شارة testimonial."
    }},
    "تكبير": { letter: "ت", interpretations: {
        "ibn-sirin": "التكبير indicator من الصلاة.",
        "nabulsi": "التكبير رمز magnification.",
        "ibn-shahin": "التكبير indicator_socket.",
        "jafar": "التكبير شارة supremacy."
    }},
    "توراة": { letter: "ت", interpretations: {
        "ibn-sirin": "التوراة رمز طمس.",
        "nabulsi": "التوراة indicator Jewish scripture.",
        "ibn-shahin": "التوراة bilsect.",
        "jafar": "التوراة شارة تمسيح."
    }},
    "نجاسة": { letter: "ن", interpretations: {
        "ibn-sirin": "النجاسة في المنام المغفرة.",
        "nabulsi": "النجاسة رمز إثم.",
        "ibn-shahin": "النجاسة indicator.",
        "jafar": "النجاسة شارة impurity."
    }}
};

if (typeof dreamDatabase !== 'undefined') {
    Object.assign(dreamDatabase, extraSymbols);
}