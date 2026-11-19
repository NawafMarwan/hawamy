/* =========================================================
   بيانات صفحة «المحتوى المرئي»
   ---------------------------------------------------------
   المحتوى منظَّم في «ألبومات»، كل ألبوم = مناسبة في سنة هجرية.
   يُجمَّع تلقائيًا حسب السنة، ويمكن تصفيته بالسنة والمناسبة.

   أنواع العناصر داخل الألبوم:
     { type: "image",   src: "assets/img/media/...webp", thumb: "...-thumb.webp", caption: "..." }
     { type: "youtube", id: "معرّف_المقطع", caption: "..." }
       (المعرّف هو الجزء بعد v= في رابط يوتيوب، أو بعد youtu.be/)

   occasion: مفتاح من قائمة occasions أدناه (يمكن إضافة مناسبات جديدة).
   ========================================================= */
window.HAWAMY_MEDIA = {
  occasions: {
    ramadan: "الدورات الرمضانية",
    summer: "الدورات الصيفية",
    graduation: "حفلات التخريج",
    honoring: "التكريم والحفلات",
    competitions: "المسابقات",
    visits: "الزيارات",
    daily: "الحلقات واليوميات"
  },
  albums: [
    {
      id: "ramadan-1447",
      title: "الدورة الرمضانية المكثفة الرابعة عشرة",
      occasion: "ramadan",
      year: 1447,
      date: "رمضان 1447هـ",
      cover: "assets/img/achievements/excellence-medal-1447.webp",
      items: [
        { type: "image", src: "assets/img/achievements/excellence-medal-1447.webp", caption: "وسام التميز في مسابقة معايير الدورات المكثفة — جمعية مكنون 1447هـ" },
        { type: "image", src: "assets/img/achievements/ramadan-courses-1447.webp", thumb: "assets/img/achievements/ramadan-courses-1447-thumb.webp", caption: "الدورات الرمضانية المميزة لعام 1447هـ" }
      ]
    }
  ]
};
