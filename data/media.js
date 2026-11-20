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
    halaqat: "مشروع الحلقات النوعية",
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
    },
    {
      id: "halaqat-1447-h1",
      title: "الحلقة الأولى",
      occasion: "halaqat",
      year: 1447,
      date: "16 جمادى الآخرة 1447هـ",
      cover: "assets/img/media/halaqat-1447/h1-03-thumb.webp",
      items: [
        { type: "image", src: "assets/img/media/halaqat-1447/h1-01.webp", thumb: "assets/img/media/halaqat-1447/h1-01-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h1-02.webp", thumb: "assets/img/media/halaqat-1447/h1-02-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h1-03.webp", thumb: "assets/img/media/halaqat-1447/h1-03-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h1-04.webp", thumb: "assets/img/media/halaqat-1447/h1-04-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h1-05.webp", thumb: "assets/img/media/halaqat-1447/h1-05-thumb.webp" }
      ]
    },
    {
      id: "halaqat-1447-h2",
      title: "الحلقة الثانية",
      occasion: "halaqat",
      year: 1447,
      date: "16 جمادى الآخرة 1447هـ",
      cover: "assets/img/media/halaqat-1447/h2-02-thumb.webp",
      items: [
        { type: "image", src: "assets/img/media/halaqat-1447/h2-01.webp", thumb: "assets/img/media/halaqat-1447/h2-01-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h2-02.webp", thumb: "assets/img/media/halaqat-1447/h2-02-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h2-03.webp", thumb: "assets/img/media/halaqat-1447/h2-03-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h2-04.webp", thumb: "assets/img/media/halaqat-1447/h2-04-thumb.webp" }
      ]
    },
    {
      id: "halaqat-1447-h3",
      title: "الحلقة الثالثة",
      occasion: "halaqat",
      year: 1447,
      date: "16 جمادى الآخرة 1447هـ",
      cover: "assets/img/media/halaqat-1447/h3-05-thumb.webp",
      items: [
        { type: "image", src: "assets/img/media/halaqat-1447/h3-01.webp", thumb: "assets/img/media/halaqat-1447/h3-01-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h3-02.webp", thumb: "assets/img/media/halaqat-1447/h3-02-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h3-03.webp", thumb: "assets/img/media/halaqat-1447/h3-03-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h3-04.webp", thumb: "assets/img/media/halaqat-1447/h3-04-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h3-05.webp", thumb: "assets/img/media/halaqat-1447/h3-05-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h3-06.webp", thumb: "assets/img/media/halaqat-1447/h3-06-thumb.webp" }
      ]
    },
    {
      id: "halaqat-1447-h4",
      title: "الحلقة الرابعة",
      occasion: "halaqat",
      year: 1447,
      date: "16 جمادى الآخرة 1447هـ",
      cover: "assets/img/media/halaqat-1447/h4-04-thumb.webp",
      items: [
        { type: "image", src: "assets/img/media/halaqat-1447/h4-01.webp", thumb: "assets/img/media/halaqat-1447/h4-01-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h4-02.webp", thumb: "assets/img/media/halaqat-1447/h4-02-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h4-03.webp", thumb: "assets/img/media/halaqat-1447/h4-03-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h4-04.webp", thumb: "assets/img/media/halaqat-1447/h4-04-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h4-05.webp", thumb: "assets/img/media/halaqat-1447/h4-05-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h4-06.webp", thumb: "assets/img/media/halaqat-1447/h4-06-thumb.webp" }
      ]
    },
    {
      id: "halaqat-1447-h5",
      title: "الحلقة الخامسة",
      occasion: "halaqat",
      year: 1447,
      date: "16 جمادى الآخرة 1447هـ",
      cover: "assets/img/media/halaqat-1447/h5-02-thumb.webp",
      items: [
        { type: "image", src: "assets/img/media/halaqat-1447/h5-01.webp", thumb: "assets/img/media/halaqat-1447/h5-01-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h5-02.webp", thumb: "assets/img/media/halaqat-1447/h5-02-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h5-03.webp", thumb: "assets/img/media/halaqat-1447/h5-03-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h5-04.webp", thumb: "assets/img/media/halaqat-1447/h5-04-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h5-05.webp", thumb: "assets/img/media/halaqat-1447/h5-05-thumb.webp" }
      ]
    },
    {
      id: "halaqat-1447-h6",
      title: "الحلقة السادسة",
      occasion: "halaqat",
      year: 1447,
      date: "16 جمادى الآخرة 1447هـ",
      cover: "assets/img/media/halaqat-1447/h6-01-thumb.webp",
      items: [
        { type: "image", src: "assets/img/media/halaqat-1447/h6-01.webp", thumb: "assets/img/media/halaqat-1447/h6-01-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h6-02.webp", thumb: "assets/img/media/halaqat-1447/h6-02-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h6-03.webp", thumb: "assets/img/media/halaqat-1447/h6-03-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h6-04.webp", thumb: "assets/img/media/halaqat-1447/h6-04-thumb.webp" }
      ]
    },
    {
      id: "halaqat-1447-h7",
      title: "الحلقة السابعة",
      occasion: "halaqat",
      year: 1447,
      date: "16 جمادى الآخرة 1447هـ",
      cover: "assets/img/media/halaqat-1447/h7-02-thumb.webp",
      items: [
        { type: "image", src: "assets/img/media/halaqat-1447/h7-01.webp", thumb: "assets/img/media/halaqat-1447/h7-01-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h7-02.webp", thumb: "assets/img/media/halaqat-1447/h7-02-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h7-03.webp", thumb: "assets/img/media/halaqat-1447/h7-03-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h7-04.webp", thumb: "assets/img/media/halaqat-1447/h7-04-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h7-05.webp", thumb: "assets/img/media/halaqat-1447/h7-05-thumb.webp" }
      ]
    },
    {
      id: "halaqat-1447-h8",
      title: "الحلقة الثامنة",
      occasion: "halaqat",
      year: 1447,
      date: "16 جمادى الآخرة 1447هـ",
      cover: "assets/img/media/halaqat-1447/h8-04-thumb.webp",
      items: [
        { type: "image", src: "assets/img/media/halaqat-1447/h8-01.webp", thumb: "assets/img/media/halaqat-1447/h8-01-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h8-02.webp", thumb: "assets/img/media/halaqat-1447/h8-02-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h8-03.webp", thumb: "assets/img/media/halaqat-1447/h8-03-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h8-04.webp", thumb: "assets/img/media/halaqat-1447/h8-04-thumb.webp" },
        { type: "image", src: "assets/img/media/halaqat-1447/h8-05.webp", thumb: "assets/img/media/halaqat-1447/h8-05-thumb.webp" }
      ]
    }
  ]
};
