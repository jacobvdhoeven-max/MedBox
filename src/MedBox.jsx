import React, { useState, useEffect, useRef, useMemo, useCallback, useId } from "react";
import {
  Bell, BellOff, Plus, X, Check, AlertTriangle, Package, PackagePlus, Trash2, Clock,
  Pencil, ChevronDown, ChevronUp, Users, Printer,
  Image as ImageIcon, ScanLine, BookOpen, ExternalLink, Utensils,
  Home, Calendar, ClipboardList, Settings2, Moon, Sun, Download, Upload,
  Flame, PartyPopper, Smartphone, Search, Phone, ArrowRight,
} from "lucide-react";

const TRANSLATIONS = {
 "loading": {
  "nl": "MedBox laden…",
  "en": "Loading MedBox…",
  "de": "MedBox wird geladen…",
  "fr": "Chargement de MedBox…",
  "es": "Cargando MedBox…",
  "tr": "MedBox yükleniyor…",
  "ar": "جارٍ تحميل MedBox…"
 },
 "theme_light": {
  "nl": "Licht",
  "en": "Light",
  "de": "Hell",
  "fr": "Clair",
  "es": "Claro",
  "tr": "Açık",
  "ar": "فاتح"
 },
 "theme_dark": {
  "nl": "Donker",
  "en": "Dark",
  "de": "Dunkel",
  "fr": "Sombre",
  "es": "Oscuro",
  "tr": "Koyu",
  "ar": "داكن"
 },
 "lang_button": {
  "nl": "Taal",
  "en": "Language",
  "de": "Sprache",
  "fr": "Langue",
  "es": "Idioma",
  "tr": "Dil",
  "ar": "اللغة"
 },
 "storage_issue_text": {
  "nl": "Je opgeslagen gegevens konden niet worden geladen. Om verlies te voorkomen wordt er nu niets automatisch opgeslagen — herlaad de pagina om het opnieuw te proberen.",
  "en": "Your saved data couldn't be loaded. To prevent data loss, nothing is being auto-saved right now — reload the page to try again.",
  "de": "Deine gespeicherten Daten konnten nicht geladen werden. Um Datenverlust zu vermeiden, wird gerade nichts automatisch gespeichert — lade die Seite neu, um es erneut zu versuchen.",
  "fr": "Tes données enregistrées n'ont pas pu être chargées. Pour éviter toute perte de données, rien n'est enregistré automatiquement pour le moment — recharge la page pour réessayer.",
  "es": "No se pudieron cargar tus datos guardados. Para evitar pérdidas, ahora mismo no se está guardando nada automáticamente — recarga la página para volver a intentarlo.",
  "tr": "Kayıtlı verilerin yüklenemedi. Veri kaybını önlemek için şu anda otomatik kayıt yapılmıyor — tekrar denemek için sayfayı yenile.",
  "ar": "تعذّر تحميل بياناتك المحفوظة. لمنع فقدان البيانات، لا يتم الحفظ التلقائي حاليًا — أعد تحميل الصفحة للمحاولة مرة أخرى."
 },
 "storage_issue_retry": {
  "nl": "Opnieuw proberen",
  "en": "Try again",
  "de": "Erneut versuchen",
  "fr": "Réessayer",
  "es": "Volver a intentarlo",
  "tr": "Tekrar dene",
  "ar": "أعد المحاولة"
 },
 "nav_today": {
  "nl": "Vandaag",
  "en": "Today",
  "de": "Heute",
  "fr": "Aujourd'hui",
  "es": "Hoy",
  "tr": "Bugün",
  "ar": "اليوم"
 },
 "nav_week": {
  "nl": "Week",
  "en": "Week",
  "de": "Woche",
  "fr": "Semaine",
  "es": "Semana",
  "tr": "Hafta",
  "ar": "الأسبوع"
 },
 "nav_manage": {
  "nl": "Beheer",
  "en": "Manage",
  "de": "Verwalten",
  "fr": "Gérer",
  "es": "Gestionar",
  "tr": "Yönet",
  "ar": "الإدارة"
 },
 "nav_settings": {
  "nl": "Instellingen",
  "en": "Settings",
  "de": "Einstellungen",
  "fr": "Paramètres",
  "es": "Ajustes",
  "tr": "Ayarlar",
  "ar": "الإعدادات"
 },
 "home_next": {
  "nl": "Volgende",
  "en": "Next",
  "de": "Nächste",
  "fr": "Prochain",
  "es": "Siguiente",
  "tr": "Sıradaki",
  "ar": "التالي"
 },
 "home_next_now": {
  "nl": "nu · {time}",
  "en": "now · {time}",
  "de": "jetzt · {time}",
  "fr": "maintenant · {time}",
  "es": "ahora · {time}",
  "tr": "şimdi · {time}",
  "ar": "الآن · {time}"
 },
 "home_next_soon": {
  "nl": "over {min} min · {time}",
  "en": "in {min} min · {time}",
  "de": "in {min} Min. · {time}",
  "fr": "dans {min} min · {time}",
  "es": "en {min} min · {time}",
  "tr": "{min} dk sonra · {time}",
  "ar": "خلال {min} دقيقة · {time}"
 },
 "home_next_at": {
  "nl": "om {time}",
  "en": "at {time}",
  "de": "um {time}",
  "fr": "à {time}",
  "es": "a las {time}",
  "tr": "{time} saatinde",
  "ar": "الساعة {time}"
 },
 "home_section_today": {
  "nl": "Vandaag",
  "en": "Today",
  "de": "Heute",
  "fr": "Aujourd'hui",
  "es": "Hoy",
  "tr": "Bugün",
  "ar": "اليوم"
 },
 "home_period_all_taken": {
  "nl": "{period} — alles genomen",
  "en": "{period} — all taken",
  "de": "{period} — alles genommen",
  "fr": "{period} — tout pris",
  "es": "{period} — todo tomado",
  "tr": "{period} — hepsi alındı",
  "ar": "{period} — تم تناول الجميع"
 },
 "home_period_potjes_one": {
  "nl": "potje",
  "en": "dose",
  "de": "Dosis",
  "fr": "dose",
  "es": "dosis",
  "tr": "doz",
  "ar": "جرعة"
 },
 "home_period_potjes_other": {
  "nl": "potjes",
  "en": "doses",
  "de": "Dosen",
  "fr": "doses",
  "es": "dosis",
  "tr": "doz",
  "ar": "جرعات"
 },
 "stat_taken": {
  "nl": "Genomen",
  "en": "Taken",
  "de": "Genommen",
  "fr": "Pris",
  "es": "Tomado",
  "tr": "Alındı",
  "ar": "تم التناول"
 },
 "stat_streak": {
  "nl": "Reeks",
  "en": "Streak",
  "de": "Serie",
  "fr": "Série",
  "es": "Racha",
  "tr": "Seri",
  "ar": "التتابع"
 },
 "stat_streak_days_one": {
  "nl": "dag",
  "en": "day",
  "de": "Tag",
  "fr": "jour",
  "es": "día",
  "tr": "gün",
  "ar": "يوم"
 },
 "stat_streak_days_other": {
  "nl": "dagen",
  "en": "days",
  "de": "Tage",
  "fr": "jours",
  "es": "días",
  "tr": "gün",
  "ar": "أيام"
 },
 "stat_notif": {
  "nl": "Meldingen",
  "en": "Notifications",
  "de": "Benachrichtigungen",
  "fr": "Notifications",
  "es": "Notificaciones",
  "tr": "Bildirimler",
  "ar": "الإشعارات"
 },
 "stat_notif_on": {
  "nl": "Aan",
  "en": "On",
  "de": "An",
  "fr": "Activé",
  "es": "Activado",
  "tr": "Açık",
  "ar": "مفعّل"
 },
 "stat_notif_off": {
  "nl": "Uit",
  "en": "Off",
  "de": "Aus",
  "fr": "Désactivé",
  "es": "Desactivado",
  "tr": "Kapalı",
  "ar": "معطّل"
 },
 "milestone_text": {
  "nl": "{n} dagen op rij — knap volgehouden!",
  "en": "{n} days in a row — well done!",
  "de": "{n} Tage in Folge — gut gemacht!",
  "fr": "{n} jours d'affilée — bravo !",
  "es": "{n} días seguidos — ¡muy bien!",
  "tr": "{n} gün üst üste — harika gidiyorsun!",
  "ar": "{n} أيام متتالية — أحسنت!"
 },
 "alldone_text": {
  "nl": "Goed gedaan! Je hebt alles vandaag afgevinkt.",
  "en": "Nice work! You've checked off everything for today.",
  "de": "Gut gemacht! Du hast heute alles abgehakt.",
  "fr": "Bravo ! Tu as tout coché pour aujourd'hui.",
  "es": "¡Buen trabajo! Has marcado todo por hoy.",
  "tr": "Harika! Bugün için her şeyi işaretledin.",
  "ar": "أحسنت! لقد أتممت كل شيء لهذا اليوم."
 },
 "missed_count_one": {
  "nl": "1 dosis gemist",
  "en": "1 dose missed",
  "de": "1 Dosis verpasst",
  "fr": "1 dose manquée",
  "es": "1 dosis olvidada",
  "tr": "1 doz kaçırıldı",
  "ar": "جرعة واحدة فائتة"
 },
 "missed_count_other": {
  "nl": "{n} doses gemist",
  "en": "{n} doses missed",
  "de": "{n} Dosen verpasst",
  "fr": "{n} doses manquées",
  "es": "{n} dosis olvidadas",
  "tr": "{n} doz kaçırıldı",
  "ar": "{n} جرعات فائتة"
 },
 "missed_snooze": {
  "nl": "+15 min",
  "en": "+15 min",
  "de": "+15 Min",
  "fr": "+15 min",
  "es": "+15 min",
  "tr": "+15 dk",
  "ar": "+15 د"
 },
 "missed_taken_anyway": {
  "nl": "Alsnog genomen",
  "en": "Mark as taken",
  "de": "Als genommen markieren",
  "fr": "Marquer comme pris",
  "es": "Marcar como tomado",
  "tr": "Alındı olarak işaretle",
  "ar": "تمييز كمأخوذة"
 },
 "refill_title": {
  "nl": "Tijd om een herhaalrecept aan te vragen",
  "en": "Time to request a refill",
  "de": "Zeit, ein neues Rezept anzufordern",
  "fr": "Il est temps de demander un renouvellement",
  "es": "Hora de pedir una nueva receta",
  "tr": "Yeni reçete isteme zamanı",
  "ar": "حان وقت طلب إعادة الصرف"
 },
 "refill_days_left": {
  "nl": "— nog ongeveer {days} {unit} voorraad, op {date} helemaal op",
  "en": "— about {days} {unit} of supply left, runs out on {date}",
  "de": "— noch etwa {days} {unit} Vorrat, leer am {date}",
  "fr": "— environ {days} {unit} de stock restant, épuisé le {date}",
  "es": "— quedan aproximadamente {days} {unit} de existencias, se agotan el {date}",
  "tr": "— yaklaşık {days} {unit} stok kaldı, {date} tarihinde biter",
  "ar": "— تبقّى ما يقارب {days} {unit} من المخزون، وينفد في {date}"
 },
 "empty_no_meds_title": {
  "nl": "Nog geen medicatie toegevoegd",
  "en": "No medication added yet",
  "de": "Noch keine Medikamente hinzugefügt",
  "fr": "Aucun médicament ajouté pour l'instant",
  "es": "Aún no has añadido medicación",
  "tr": "Henüz ilaç eklenmedi",
  "ar": "لم تتم إضافة أي دواء بعد"
 },
 "empty_no_meds_body": {
  "nl": "Voeg je eerste medicijn toe om je digitale MedBox te vullen.",
  "en": "Add your first medication to fill your digital MedBox.",
  "de": "Füge dein erstes Medikament hinzu, um deine digitale MedBox zu füllen.",
  "fr": "Ajoute ton premier médicament pour remplir ta MedBox numérique.",
  "es": "Añade tu primer medicamento para llenar tu MedBox digital.",
  "tr": "Dijital MedBox'ını doldurmak için ilk ilacını ekle.",
  "ar": "أضف أول دواء لملء صندوق MedBox الرقمي الخاص بك."
 },
 "empty_add_med_button": {
  "nl": "+ Medicijn toevoegen",
  "en": "+ Add medication",
  "de": "+ Medikament hinzufügen",
  "fr": "+ Ajouter un médicament",
  "es": "+ Añadir medicamento",
  "tr": "+ İlaç ekle",
  "ar": "+ إضافة دواء"
 },
 "progress_today_title": {
  "nl": "Voortgang vandaag",
  "en": "Today's progress",
  "de": "Heutiger Fortschritt",
  "fr": "Progression du jour",
  "es": "Progreso de hoy",
  "tr": "Bugünkü ilerleme",
  "ar": "تقدّم اليوم"
 },
 "progress_today_combined_meds_one": {
  "nl": "Van {n} medicijn samen",
  "en": "From {n} medication combined",
  "de": "Von {n} Medikament zusammen",
  "fr": "Pour {n} médicament au total",
  "es": "De {n} medicamento en total",
  "tr": "{n} ilaçtan toplam",
  "ar": "من دواء واحد مجتمعين"
 },
 "progress_today_combined_meds_other": {
  "nl": "Van {n} medicijnen samen",
  "en": "From {n} medications combined",
  "de": "Von {n} Medikamenten zusammen",
  "fr": "Pour {n} médicaments au total",
  "es": "De {n} medicamentos en total",
  "tr": "{n} ilaçtan toplam",
  "ar": "من {n} أدوية مجتمعة"
 },
 "prn_title": {
  "nl": "Indien nodig",
  "en": "As needed",
  "de": "Bei Bedarf",
  "fr": "Au besoin",
  "es": "Si es necesario",
  "tr": "Gerektiğinde",
  "ar": "عند الحاجة"
 },
 "prn_today_count": {
  "nl": "· vandaag {n}×",
  "en": "· {n}× today",
  "de": "· heute {n}×",
  "fr": "· {n}× aujourd'hui",
  "es": "· {n}× hoy",
  "tr": "· bugün {n}×",
  "ar": "· {n}× اليوم"
 },
 "prn_not_taken_today": {
  "nl": "· nog niet genomen vandaag",
  "en": "· not taken today yet",
  "de": "· heute noch nicht genommen",
  "fr": "· pas encore pris aujourd'hui",
  "es": "· aún no tomado hoy",
  "tr": "· bugün henüz alınmadı",
  "ar": "· لم تُؤخذ اليوم بعد"
 },
 "prn_undo": {
  "nl": "laatste ongedaan maken",
  "en": "undo last one",
  "de": "letzte rückgängig machen",
  "fr": "annuler la dernière",
  "es": "deshacer la última",
  "tr": "sonuncuyu geri al",
  "ar": "التراجع عن الأخيرة"
 },
 "prn_take_now": {
  "nl": "Nu genomen",
  "en": "Taken now",
  "de": "Jetzt genommen",
  "fr": "Pris maintenant",
  "es": "Tomado ahora",
  "tr": "Şimdi alındı",
  "ar": "تم الآن"
 },
 "week_title": {
  "nl": "Weekoverzicht",
  "en": "Week overview",
  "de": "Wochenübersicht",
  "fr": "Aperçu de la semaine",
  "es": "Resumen semanal",
  "tr": "Haftalık genel bakış",
  "ar": "نظرة عامة على الأسبوع"
 },
 "week_empty": {
  "nl": "Voeg eerst medicatie toe om een weekoverzicht te zien.",
  "en": "Add medication first to see a week overview.",
  "de": "Füge zuerst Medikamente hinzu, um eine Wochenübersicht zu sehen.",
  "fr": "Ajoute d'abord des médicaments pour voir un aperçu de la semaine.",
  "es": "Añade primero medicación para ver un resumen semanal.",
  "tr": "Haftalık genel bakışı görmek için önce ilaç ekle.",
  "ar": "أضف دواءً أولًا لعرض نظرة عامة على الأسبوع."
 },
 "week_prev": {
  "nl": "‹ Vorige",
  "en": "‹ Previous",
  "de": "‹ Vorherige",
  "fr": "‹ Précédente",
  "es": "‹ Anterior",
  "tr": "‹ Önceki",
  "ar": "‹ السابق"
 },
 "week_next": {
  "nl": "Volgende ›",
  "en": "Next ›",
  "de": "Nächste ›",
  "fr": "Suivante ›",
  "es": "Siguiente ›",
  "tr": "Sonraki ›",
  "ar": "التالي ›"
 },
 "week_this": {
  "nl": "Deze week",
  "en": "This week",
  "de": "Diese Woche",
  "fr": "Cette semaine",
  "es": "Esta semana",
  "tr": "Bu hafta",
  "ar": "هذا الأسبوع"
 },
 "week_last": {
  "nl": "Vorige week",
  "en": "Last week",
  "de": "Letzte Woche",
  "fr": "Semaine dernière",
  "es": "Semana pasada",
  "tr": "Geçen hafta",
  "ar": "الأسبوع الماضي"
 },
 "week_weeks_ago": {
  "nl": "{n} weken geleden",
  "en": "{n} weeks ago",
  "de": "vor {n} Wochen",
  "fr": "il y a {n} semaines",
  "es": "hace {n} semanas",
  "tr": "{n} hafta önce",
  "ar": "قبل {n} أسابيع"
 },
 "week_trend_title": {
  "nl": "Trouw deze week",
  "en": "Adherence this week",
  "de": "Einnahmetreue diese Woche",
  "fr": "Régularité cette semaine",
  "es": "Constancia esta semana",
  "tr": "Bu hafta ilaç uyumu",
  "ar": "الالتزام هذا الأسبوع"
 },
 "week_today_badge": {
  "nl": "Vandaag",
  "en": "Today",
  "de": "Heute",
  "fr": "Aujourd'hui",
  "es": "Hoy",
  "tr": "Bugün",
  "ar": "اليوم"
 },
 "week_no_meds_day": {
  "nl": "Geen medicatie gepland.",
  "en": "No medication scheduled.",
  "de": "Keine Medikamente geplant.",
  "fr": "Aucun médicament prévu.",
  "es": "No hay medicación programada.",
  "tr": "Planlanmış ilaç yok.",
  "ar": "لا يوجد دواء مجدول."
 },
 "beheer_title": {
  "nl": "Medicatie beheren",
  "en": "Manage medication",
  "de": "Medikamente verwalten",
  "fr": "Gérer les médicaments",
  "es": "Gestionar medicación",
  "tr": "İlaçları yönet",
  "ar": "إدارة الأدوية"
 },
 "beheer_search_placeholder": {
  "nl": "Zoek medicatie...",
  "en": "Search medication...",
  "de": "Medikament suchen…",
  "fr": "Rechercher un médicament…",
  "es": "Buscar medicación…",
  "tr": "İlaç ara…",
  "ar": "ابحث عن دواء…"
 },
 "beheer_search_empty": {
  "nl": "Geen medicatie gevonden voor \"{q}\".",
  "en": "No medication found for \"{q}\".",
  "de": "Keine Medikamente gefunden für „{q}\".",
  "fr": "Aucun médicament trouvé pour « {q} ».",
  "es": "No se encontró medicación para «{q}».",
  "tr": "\"{q}\" için ilaç bulunamadı.",
  "ar": "لم يتم العثور على دواء لـ \"{q}\"."
 },
 "beheer_prn_summary": {
  "nl": "Indien nodig",
  "en": "As needed",
  "de": "Bei Bedarf",
  "fr": "Au besoin",
  "es": "Si es necesario",
  "tr": "Gerektiğinde",
  "ar": "عند الحاجة"
 },
 "beheer_no_weekdays": {
  "nl": "geen dagen gekozen",
  "en": "no days chosen",
  "de": "keine Tage ausgewählt",
  "fr": "aucun jour choisi",
  "es": "sin días seleccionados",
  "tr": "gün seçilmedi",
  "ar": "لم يتم اختيار أيام"
 },
 "beheer_per_day": {
  "nl": "{n} {unit}/dag",
  "en": "{n} {unit}/day",
  "de": "{n} {unit}/Tag",
  "fr": "{n} {unit}/jour",
  "es": "{n} {unit}/día",
  "tr": "{n} {unit}/gün",
  "ar": "{n} {unit}/يوم"
 },
 "beheer_stock": {
  "nl": "· voorraad: {n}",
  "en": "· stock: {n}",
  "de": "· Vorrat: {n}",
  "fr": "· stock : {n}",
  "es": "· existencias: {n}",
  "tr": "· stok: {n}",
  "ar": "· المخزون: {n}"
 },
 "beheer_leaflet_title": {
  "nl": "Bijsluiter",
  "en": "Leaflet",
  "de": "Beipackzettel",
  "fr": "Notice",
  "es": "Prospecto",
  "tr": "Prospektüs",
  "ar": "النشرة"
 },
 "beheer_restock_title": {
  "nl": "Voorraad aanvullen",
  "en": "Restock",
  "de": "Auffüllen",
  "fr": "Réapprovisionner",
  "es": "Reponer",
  "tr": "Stok ekle",
  "ar": "تجديد المخزون"
 },
 "beheer_add_button": {
  "nl": "+ Medicijn toevoegen",
  "en": "+ Add medication",
  "de": "+ Medikament hinzufügen",
  "fr": "+ Ajouter un médicament",
  "es": "+ Añadir medicamento",
  "tr": "+ İlaç ekle",
  "ar": "+ إضافة دواء"
 },
 "settings_title": {
  "nl": "Instellingen",
  "en": "Settings",
  "de": "Einstellungen",
  "fr": "Paramètres",
  "es": "Ajustes",
  "tr": "Ayarlar",
  "ar": "الإعدادات"
 },
 "settings_accessibility_title": {
  "nl": "Toegankelijkheid",
  "en": "Accessibility",
  "de": "Barrierefreiheit",
  "fr": "Accessibilité",
  "es": "Accesibilidad",
  "tr": "Erişilebilirlik",
  "ar": "إمكانية الوصول"
 },
 "settings_textsize_label": {
  "nl": "Tekstgrootte",
  "en": "Text size",
  "de": "Textgröße",
  "fr": "Taille du texte",
  "es": "Tamaño del texto",
  "tr": "Metin boyutu",
  "ar": "حجم النص"
 },
 "textsize_normaal": {
  "nl": "Normaal",
  "en": "Normal",
  "de": "Normal",
  "fr": "Normal",
  "es": "Normal",
  "tr": "Normal",
  "ar": "عادي"
 },
 "textsize_groot": {
  "nl": "Groot",
  "en": "Large",
  "de": "Groß",
  "fr": "Grand",
  "es": "Grande",
  "tr": "Büyük",
  "ar": "كبير"
 },
 "textsize_extra_groot": {
  "nl": "Extra groot",
  "en": "Extra large",
  "de": "Extra groß",
  "fr": "Très grand",
  "es": "Extra grande",
  "tr": "Ekstra büyük",
  "ar": "كبير جدًا"
 },
 "settings_contrast_toggle": {
  "nl": "Hoog contrast",
  "en": "High contrast",
  "de": "Hoher Kontrast",
  "fr": "Contraste élevé",
  "es": "Alto contraste",
  "tr": "Yüksek kontrast",
  "ar": "تباين عالٍ"
 },
 "settings_contrast_explain": {
  "nl": "Maakt tekst en randen donkerder/lichter voor beter leesbaar contrast.",
  "en": "Makes text and borders darker/lighter for better readable contrast.",
  "de": "Macht Text und Ränder dunkler/heller für besser lesbaren Kontrast.",
  "fr": "Assombrit/éclaircit le texte et les bordures pour un contraste plus lisible.",
  "es": "Oscurece/aclara el texto y los bordes para un contraste más legible.",
  "tr": "Daha okunaklı bir kontrast için metni ve kenarlıkları koyulaştırır/açar.",
  "ar": "يجعل النص والحدود أغمق/أفتح لتباين أوضح للقراءة."
 },
 "settings_notif_title": {
  "nl": "Meldingen",
  "en": "Notifications",
  "de": "Benachrichtigungen",
  "fr": "Notifications",
  "es": "Notificaciones",
  "tr": "Bildirimler",
  "ar": "الإشعارات"
 },
 "settings_notif_label": {
  "nl": "Meldingen bij innametijden",
  "en": "Reminders at dose times",
  "de": "Erinnerungen zu den Einnahmezeiten",
  "fr": "Rappels aux heures de prise",
  "es": "Recordatorios a las horas de toma",
  "tr": "Doz saatlerinde hatırlatmalar",
  "ar": "تذكيرات في أوقات الجرعات"
 },
 "settings_notif_enable": {
  "nl": "Inschakelen",
  "en": "Enable",
  "de": "Aktivieren",
  "fr": "Activer",
  "es": "Activar",
  "tr": "Etkinleştir",
  "ar": "تفعيل"
 },
 "settings_notif_explain": {
  "nl": "Meldingen werken zolang deze app open staat. \"Na maaltijd\"-momenten hebben geen vaste tijd, maar je krijgt wel een melding zodra het dagdeel voorbij is als het nog niet is afgevinkt.",
  "en": "Reminders only work while this app stays open. \"After meal\" moments have no fixed time, but you'll still get a reminder once that part of the day ends if it's not checked off yet.",
  "de": "Erinnerungen funktionieren nur, solange diese App geöffnet bleibt. „Nach der Mahlzeit\"-Momente haben keine feste Uhrzeit, aber du bekommst trotzdem eine Erinnerung, sobald dieser Tagesabschnitt endet, falls es noch nicht abgehakt ist.",
  "fr": "Les rappels ne fonctionnent que tant que cette appli reste ouverte. Les moments « après le repas » n'ont pas d'heure fixe, mais tu recevras quand même un rappel dès la fin de cette période de la journée si ce n'est pas encore coché.",
  "es": "Los recordatorios solo funcionan mientras esta app permanece abierta. Los momentos «después de la comida» no tienen hora fija, pero aun así recibirás un recordatorio cuando termine esa franja del día si todavía no lo has marcado.",
  "tr": "Hatırlatmalar yalnızca bu uygulama açık kaldığı sürece çalışır. \"Yemekten sonra\" anlarının sabit bir saati yoktur, ancak henüz işaretlenmediyse o gün diliminin sonunda yine de bir hatırlatma alırsın.",
  "ar": "تعمل التذكيرات فقط أثناء بقاء هذا التطبيق مفتوحًا. لحظات \"بعد الوجبة\" ليس لها وقت ثابت، لكنك ستتلقى تذكيرًا بمجرد انتهاء ذلك الجزء من اليوم إذا لم يتم تسجيلها بعد."
 },
 "settings_notif_denied_label": {
  "nl": "Geblokkeerd",
  "en": "Blocked",
  "de": "Blockiert",
  "fr": "Bloqué",
  "es": "Bloqueado",
  "tr": "Engellendi",
  "ar": "محظور"
 },
 "settings_notif_denied": {
  "nl": "Je hebt meldingen eerder geblokkeerd in je browser. Om ze weer aan te zetten, moet je dit wijzigen bij de site-instellingen van je browser (vaak via het slotje of i-icoontje naast de adresbalk) — dat kan deze app zelf niet voor je doen.",
  "en": "You blocked notifications for this site earlier in your browser. To turn them back on, change this in your browser's site settings (often via the lock or info icon next to the address bar) — the app itself can't do this for you.",
  "de": "Du hast Benachrichtigungen für diese Seite zuvor in deinem Browser blockiert. Um sie wieder zu aktivieren, musst du dies in den Website-Einstellungen deines Browsers ändern (oft über das Schloss- oder Info-Symbol neben der Adressleiste) — das kann die App selbst nicht für dich erledigen.",
  "fr": "Tu as bloqué les notifications pour ce site plus tôt dans ton navigateur. Pour les réactiver, modifie cela dans les paramètres du site de ton navigateur (souvent via l'icône de cadenas ou d'info à côté de la barre d'adresse) — l'appli elle-même ne peut pas le faire à ta place.",
  "es": "Bloqueaste las notificaciones de este sitio antes en tu navegador. Para volver a activarlas, cámbialo en la configuración del sitio de tu navegador (a menudo mediante el icono de candado o de información junto a la barra de direcciones) — la app en sí no puede hacerlo por ti.",
  "tr": "Bu site için bildirimleri daha önce tarayıcında engelledin. Tekrar açmak için bunu tarayıcının site ayarlarından değiştirmen gerekir (genellikle adres çubuğunun yanındaki kilit veya bilgi simgesi üzerinden) — uygulama bunu senin için yapamaz.",
  "ar": "لقد حظرت الإشعارات لهذا الموقع سابقًا في متصفحك. لإعادة تفعيلها، عليك تغيير ذلك في إعدادات الموقع في متصفحك (غالبًا عبر أيقونة القفل أو المعلومات بجانب شريط العنوان) — لا يمكن للتطبيق نفسه القيام بذلك نيابة عنك."
 },
 "settings_home_title": {
  "nl": "Beginscherm",
  "en": "Home screen",
  "de": "Startbildschirm",
  "fr": "Écran d'accueil",
  "es": "Pantalla de inicio",
  "tr": "Ana ekran",
  "ar": "الشاشة الرئيسية"
 },
 "settings_home_headline": {
  "nl": "Zet MedBox op je beginscherm",
  "en": "Add MedBox to your home screen",
  "de": "MedBox zum Startbildschirm hinzufügen",
  "fr": "Ajouter MedBox à ton écran d'accueil",
  "es": "Añade MedBox a tu pantalla de inicio",
  "tr": "MedBox'ı ana ekranına ekle",
  "ar": "أضف MedBox إلى شاشتك الرئيسية"
 },
 "settings_home_iphone": {
  "nl": "tik in Safari op het deelknopje onderin en kies \"Zet op beginscherm\".",
  "en": "in Safari, tap the share button at the bottom and choose \"Add to Home Screen\".",
  "de": "tippe in Safari unten auf das Teilen-Symbol und wähle „Zum Home-Bildschirm\".",
  "fr": "dans Safari, appuie sur le bouton de partage en bas et choisis « Sur l'écran d'accueil ».",
  "es": "en Safari, toca el botón de compartir en la parte inferior y elige «Añadir a pantalla de inicio».",
  "tr": "Safari'de alttaki paylaş simgesine dokun ve \"Ana Ekrana Ekle\" seçeneğini seç.",
  "ar": "في Safari، اضغط على زر المشاركة في الأسفل واختر \"إضافة إلى الشاشة الرئيسية\"."
 },
 "settings_home_android": {
  "nl": "tik in Chrome op de drie puntjes rechtsboven en kies \"Toevoegen aan startscherm\".",
  "en": "in Chrome, tap the three dots top-right and choose \"Add to Home screen\".",
  "de": "tippe in Chrome oben rechts auf die drei Punkte und wähle „Zum Startbildschirm hinzufügen\".",
  "fr": "dans Chrome, appuie sur les trois points en haut à droite et choisis « Ajouter à l'écran d'accueil ».",
  "es": "en Chrome, toca los tres puntos arriba a la derecha y elige «Añadir a pantalla de inicio».",
  "tr": "Chrome'da sağ üstteki üç noktaya dokun ve \"Ana ekrana ekle\" seçeneğini seç.",
  "ar": "في Chrome، اضغط على النقاط الثلاث أعلى اليمين واختر \"إضافة إلى الشاشة الرئيسية\"."
 },
 "settings_home_footer": {
  "nl": "Zo open je MedBox voortaan met één tik, net als een echte app.",
  "en": "That way you can open MedBox with one tap from now on, just like a real app.",
  "de": "So kannst du MedBox von jetzt an mit einem Fingertipp öffnen, genau wie eine echte App.",
  "fr": "Ainsi, tu pourras ouvrir MedBox en un seul geste, comme une vraie appli.",
  "es": "Así podrás abrir MedBox con un solo toque a partir de ahora, como una app de verdad.",
  "tr": "Böylece MedBox'ı artık gerçek bir uygulama gibi tek dokunuşla açabilirsin.",
  "ar": "بهذه الطريقة يمكنك فتح MedBox بلمسة واحدة من الآن فصاعدًا، تمامًا مثل أي تطبيق حقيقي."
 },
 "settings_home_hidden": {
  "nl": "Tip om MedBox op je beginscherm te zetten is verborgen.",
  "en": "The tip about adding MedBox to your home screen is hidden.",
  "de": "Der Tipp zum Hinzufügen von MedBox zum Startbildschirm ist ausgeblendet.",
  "fr": "L'astuce pour ajouter MedBox à ton écran d'accueil est masquée.",
  "es": "El consejo para añadir MedBox a tu pantalla de inicio está oculto.",
  "tr": "MedBox'ı ana ekrana ekleme ipucu gizlendi.",
  "ar": "تم إخفاء نصيحة إضافة MedBox إلى شاشتك الرئيسية."
 },
 "settings_home_show_again": {
  "nl": "Opnieuw tonen",
  "en": "Show again",
  "de": "Erneut anzeigen",
  "fr": "Réafficher",
  "es": "Mostrar de nuevo",
  "tr": "Tekrar göster",
  "ar": "إظهار مرة أخرى"
 },
 "settings_backup_title": {
  "nl": "Back-up",
  "en": "Backup",
  "de": "Backup",
  "fr": "Sauvegarde",
  "es": "Copia de seguridad",
  "tr": "Yedekleme",
  "ar": "النسخ الاحتياطي"
 },
 "settings_backup_explain": {
  "nl": "Je gegevens staan alleen op dit apparaat. Maak af en toe een back-up, zodat je niets kwijtraakt bij een nieuwe telefoon of browser.",
  "en": "Your data lives only on this device. Make a backup now and then, so you don't lose anything with a new phone or browser.",
  "de": "Deine Daten befinden sich nur auf diesem Gerät. Erstelle hin und wieder ein Backup, damit bei einem neuen Handy oder Browser nichts verloren geht.",
  "fr": "Tes données ne se trouvent que sur cet appareil. Fais une sauvegarde de temps en temps pour ne rien perdre en cas de nouveau téléphone ou navigateur.",
  "es": "Tus datos solo están en este dispositivo. Haz una copia de seguridad de vez en cuando para no perder nada si cambias de teléfono o navegador.",
  "tr": "Verilerin yalnızca bu cihazda bulunuyor. Yeni bir telefon veya tarayıcıda hiçbir şey kaybetmemek için ara sıra yedek al.",
  "ar": "بياناتك موجودة فقط على هذا الجهاز. أنشئ نسخة احتياطية بين الحين والآخر حتى لا تفقد شيئًا عند الانتقال إلى هاتف أو متصفح جديد."
 },
 "settings_backup_export": {
  "nl": "Exporteren",
  "en": "Export",
  "de": "Exportieren",
  "fr": "Exporter",
  "es": "Exportar",
  "tr": "Dışa aktar",
  "ar": "تصدير"
 },
 "settings_backup_import": {
  "nl": "Importeren",
  "en": "Import",
  "de": "Importieren",
  "fr": "Importer",
  "es": "Importar",
  "tr": "İçe aktar",
  "ar": "استيراد"
 },
 "settings_backup_never": {
  "nl": "Je hebt nog geen back-up gemaakt.",
  "en": "You haven't made a backup yet.",
  "de": "Du hast noch kein Backup erstellt.",
  "fr": "Tu n'as pas encore fait de sauvegarde.",
  "es": "Aún no has hecho una copia de seguridad.",
  "tr": "Henüz yedek almadın.",
  "ar": "لم تُنشئ نسخة احتياطية بعد."
 },
 "settings_backup_today": {
  "nl": "Laatste back-up: vandaag.",
  "en": "Last backup: today.",
  "de": "Letztes Backup: heute.",
  "fr": "Dernière sauvegarde : aujourd'hui.",
  "es": "Última copia de seguridad: hoy.",
  "tr": "Son yedekleme: bugün.",
  "ar": "آخر نسخة احتياطية: اليوم."
 },
 "settings_backup_yesterday": {
  "nl": "Laatste back-up: gisteren.",
  "en": "Last backup: yesterday.",
  "de": "Letztes Backup: gestern.",
  "fr": "Dernière sauvegarde : hier.",
  "es": "Última copia de seguridad: ayer.",
  "tr": "Son yedekleme: dün.",
  "ar": "آخر نسخة احتياطية: أمس."
 },
 "settings_backup_days_ago": {
  "nl": "Laatste back-up: {n} dagen geleden.",
  "en": "Last backup: {n} days ago.",
  "de": "Letztes Backup: vor {n} Tagen.",
  "fr": "Dernière sauvegarde : il y a {n} jours.",
  "es": "Última copia de seguridad: hace {n} días.",
  "tr": "Son yedekleme: {n} gün önce.",
  "ar": "آخر نسخة احتياطية: قبل {n} أيام."
 },
 "settings_backup_nudge": {
  "nl": " Misschien tijd voor een nieuwe?",
  "en": " Maybe time for a new one?",
  "de": " Vielleicht Zeit für ein neues?",
  "fr": " Peut-être temps d'en refaire une ?",
  "es": " ¿Quizá sea hora de otra?",
  "tr": " Belki yeni bir tane zamanı gelmiştir?",
  "ar": " ربما حان وقت نسخة جديدة؟"
 },
 "settings_periods_title": {
  "nl": "Dagdelen aanpassen",
  "en": "Adjust time-of-day periods",
  "de": "Tagesabschnitte anpassen",
  "fr": "Ajuster les périodes de la journée",
  "es": "Ajustar las franjas del día",
  "tr": "Gün dilimlerini ayarla",
  "ar": "تعديل أوقات اليوم"
 },
 "settings_calendar_title": {
  "nl": "Agenda-export",
  "en": "Calendar export",
  "de": "Kalenderexport",
  "fr": "Export vers l'agenda",
  "es": "Exportar al calendario",
  "tr": "Takvime aktarma",
  "ar": "تصدير إلى التقويم"
 },
 "settings_calendar_toggle": {
  "nl": "Agenda-export inschakelen",
  "en": "Enable calendar export",
  "de": "Kalenderexport aktivieren",
  "fr": "Activer l'export vers l'agenda",
  "es": "Activar la exportación al calendario",
  "tr": "Takvime aktarmayı etkinleştir",
  "ar": "تفعيل التصدير إلى التقويم"
 },
 "settings_calendar_explain": {
  "nl": "Maakt een .ics-bestand met de innametijden van je medicatie, dat je kunt openen in Google Agenda, Apple Agenda of Outlook. Momenten \"na een maaltijd\" krijgen een geschat tijdstip.",
  "en": "Creates an .ics file with your medication times, which you can open in Google Calendar, Apple Calendar or Outlook. \"After a meal\" moments get an estimated time.",
  "de": "Erstellt eine .ics-Datei mit deinen Einnahmezeiten, die du in Google Kalender, Apple Kalender oder Outlook öffnen kannst. Momente \"nach einer Mahlzeit\" erhalten eine geschätzte Uhrzeit.",
  "fr": "Crée un fichier .ics avec tes heures de prise, à ouvrir dans Google Agenda, Apple Agenda ou Outlook. Les moments \"après un repas\" reçoivent une heure estimée.",
  "es": "Crea un archivo .ics con tus horarios de medicación, que puedes abrir en Google Calendar, Apple Calendario u Outlook. Los momentos \"después de una comida\" reciben una hora estimada.",
  "tr": "İlaç saatlerinle bir .ics dosyası oluşturur; bunu Google Takvim, Apple Takvim veya Outlook'ta açabilirsin. \"Öğünden sonra\" anları tahmini bir saat alır.",
  "ar": "ينشئ ملف .ics بأوقات دوائك، يمكنك فتحه في تقويم Google أو تقويم Apple أو Outlook. تحصل لحظات \"بعد وجبة\" على وقت تقديري."
 },
 "settings_calendar_export_button": {
  "nl": "Exporteren naar agenda (.ics)",
  "en": "Export to calendar (.ics)",
  "de": "In Kalender exportieren (.ics)",
  "fr": "Exporter vers l'agenda (.ics)",
  "es": "Exportar al calendario (.ics)",
  "tr": "Takvime aktar (.ics)",
  "ar": "تصدير إلى التقويم (.ics)"
 },
 "ics_approx_note": {
  "nl": "geschat tijdstip",
  "en": "estimated time",
  "de": "geschätzte Uhrzeit",
  "fr": "heure estimée",
  "es": "hora estimada",
  "tr": "tahmini saat",
  "ar": "وقت تقديري"
 },
 "settings_periods_explain": {
  "nl": "Vanaf welk tijdstip begint elk dagdeel? \"Na maaltijd\"-momenten volgen altijd hun eigen dagdeel (ontbijt → ochtend, lunch → middag, diner → avond).",
  "en": "What time does each part of the day start? \"After meal\" moments always follow their own period (breakfast → morning, lunch → afternoon, dinner → evening).",
  "de": "Um wie viel Uhr beginnt jeder Tagesabschnitt? „Nach der Mahlzeit\"-Momente folgen immer ihrem eigenen Abschnitt (Frühstück → Morgen, Mittagessen → Nachmittag, Abendessen → Abend).",
  "fr": "À quelle heure commence chaque période de la journée ? Les moments « après le repas » suivent toujours leur propre période (petit-déjeuner → matin, déjeuner → après-midi, dîner → soir).",
  "es": "¿A qué hora empieza cada franja del día? Los momentos «después de la comida» siempre siguen su propia franja (desayuno → mañana, comida → tarde, cena → noche).",
  "tr": "Her gün dilimi saat kaçta başlar? \"Yemekten sonra\" anları her zaman kendi dilimini takip eder (kahvaltı → sabah, öğle yemeği → öğleden sonra, akşam yemeği → akşam).",
  "ar": "في أي وقت يبدأ كل جزء من اليوم؟ لحظات \"بعد الوجبة\" تتبع دائمًا فترتها الخاصة (الفطور ← الصباح، الغداء ← بعد الظهر، العشاء ← المساء)."
 },
 "settings_periods_from": {
  "nl": "{period} vanaf",
  "en": "{period} from",
  "de": "{period} ab",
  "fr": "{period} à partir de",
  "es": "{period} desde",
  "tr": "{period} başlangıcı",
  "ar": "{period} من"
 },
 "settings_emergency_title": {
  "nl": "Noodinformatie",
  "en": "Emergency information",
  "de": "Notfallinformationen",
  "fr": "Informations d'urgence",
  "es": "Información de emergencia",
  "tr": "Acil durum bilgileri",
  "ar": "معلومات الطوارئ"
 },
 "settings_emergency_explain": {
  "nl": "Vul dit één keer in, zodat je altijd een noodkaart bij de hand hebt met je actuele medicatie, allergieën en contactgegevens — handig om te laten zien in een noodsituatie.",
  "en": "Fill this in once, so you always have an emergency card at hand with your current medication, allergies and contact details — handy to show in an emergency.",
  "de": "Fülle dies einmal aus, damit du immer eine Notfallkarte mit deinen aktuellen Medikamenten, Allergien und Kontaktdaten zur Hand hast — praktisch, um sie im Notfall zu zeigen.",
  "fr": "Remplis ceci une fois, pour toujours avoir sous la main une carte d'urgence avec tes médicaments actuels, allergies et coordonnées — pratique à montrer en cas d'urgence.",
  "es": "Rellena esto una vez, así siempre tendrás a mano una tarjeta de emergencia con tu medicación actual, alergias y datos de contacto — útil para mostrar en una emergencia.",
  "tr": "Bunu bir kez doldur, böylece güncel ilaçların, alerjilerin ve iletişim bilgilerinle her zaman elinin altında bir acil durum kartı olur — acil bir durumda göstermek için kullanışlıdır.",
  "ar": "املأ هذا مرة واحدة، لتحتفظ دائمًا ببطاقة طوارئ تتضمّن أدويتك الحالية وحساسياتك وبيانات التواصل — مفيدة لعرضها في حالة الطوارئ."
 },
 "field_allergies": {
  "nl": "Allergieën",
  "en": "Allergies",
  "de": "Allergien",
  "fr": "Allergies",
  "es": "Alergias",
  "tr": "Alerjiler",
  "ar": "الحساسية"
 },
 "field_allergies_placeholder": {
  "nl": "Bijv. penicilline",
  "en": "E.g. penicillin",
  "de": "Z. B. Penicillin",
  "fr": "Ex. pénicilline",
  "es": "P. ej. penicilina",
  "tr": "Örn. penisilin",
  "ar": "مثال: البنسلين"
 },
 "field_contact_name": {
  "nl": "Noodcontact naam",
  "en": "Emergency contact name",
  "de": "Name Notfallkontakt",
  "fr": "Nom du contact d'urgence",
  "es": "Nombre del contacto de emergencia",
  "tr": "Acil durum kişisi adı",
  "ar": "اسم جهة اتصال الطوارئ"
 },
 "field_contact_phone": {
  "nl": "Noodcontact telefoon",
  "en": "Emergency contact phone",
  "de": "Telefon Notfallkontakt",
  "fr": "Téléphone du contact d'urgence",
  "es": "Teléfono del contacto de emergencia",
  "tr": "Acil durum kişisi telefonu",
  "ar": "هاتف جهة اتصال الطوارئ"
 },
 "field_doctor_name": {
  "nl": "Huisarts naam",
  "en": "GP name",
  "de": "Name Hausarzt",
  "fr": "Nom du médecin traitant",
  "es": "Nombre del médico de cabecera",
  "tr": "Aile hekimi adı",
  "ar": "اسم طبيب الأسرة"
 },
 "field_doctor_phone": {
  "nl": "Huisarts telefoon",
  "en": "GP phone",
  "de": "Telefon Hausarzt",
  "fr": "Téléphone du médecin traitant",
  "es": "Teléfono del médico de cabecera",
  "tr": "Aile hekimi telefonu",
  "ar": "هاتف طبيب الأسرة"
 },
 "field_pharmacy_name": {
  "nl": "Apotheek naam",
  "en": "Pharmacy name",
  "de": "Name Apotheke",
  "fr": "Nom de la pharmacie",
  "es": "Nombre de la farmacia",
  "tr": "Eczane adı",
  "ar": "اسم الصيدلية"
 },
 "field_pharmacy_phone": {
  "nl": "Apotheek telefoon",
  "en": "Pharmacy phone",
  "de": "Telefon Apotheke",
  "fr": "Téléphone de la pharmacie",
  "es": "Teléfono de la farmacia",
  "tr": "Eczane telefonu",
  "ar": "هاتف الصيدلية"
 },
 "field_name_placeholder": {
  "nl": "Naam",
  "en": "Name",
  "de": "Name",
  "fr": "Nom",
  "es": "Nombre",
  "tr": "Ad",
  "ar": "الاسم"
 },
 "field_practice_placeholder": {
  "nl": "Naam praktijk",
  "en": "Practice name",
  "de": "Name der Praxis",
  "fr": "Nom du cabinet",
  "es": "Nombre de la consulta",
  "tr": "Klinik adı",
  "ar": "اسم العيادة"
 },
 "field_pharmacy_placeholder": {
  "nl": "Naam apotheek",
  "en": "Pharmacy name",
  "de": "Name der Apotheke",
  "fr": "Nom de la pharmacie",
  "es": "Nombre de la farmacia",
  "tr": "Eczane adı",
  "ar": "اسم الصيدلية"
 },
 "settings_emergency_view_button": {
  "nl": "Noodkaart bekijken",
  "en": "View emergency card",
  "de": "Notfallkarte ansehen",
  "fr": "Voir la carte d'urgence",
  "es": "Ver tarjeta de emergencia",
  "tr": "Acil durum kartını görüntüle",
  "ar": "عرض بطاقة الطوارئ"
 },
 "settings_report_title": {
  "nl": "Maandrapport voor arts of apotheek",
  "en": "Monthly report for doctor or pharmacy",
  "de": "Monatsbericht für Arzt oder Apotheke",
  "fr": "Rapport mensuel pour le médecin ou la pharmacie",
  "es": "Informe mensual para el médico o la farmacia",
  "tr": "Doktor veya eczane için aylık rapor",
  "ar": "التقرير الشهري للطبيب أو الصيدلية"
 },
 "settings_report_button": {
  "nl": "Maandrapport openen & afdrukken",
  "en": "Open & print monthly report",
  "de": "Monatsbericht öffnen & drucken",
  "fr": "Ouvrir et imprimer le rapport mensuel",
  "es": "Abrir e imprimir informe mensual",
  "tr": "Aylık raporu aç ve yazdır",
  "ar": "فتح التقرير الشهري وطباعته"
 },
 "emergency_title": {
  "nl": "Noodkaart",
  "en": "Emergency card",
  "de": "Notfallkarte",
  "fr": "Carte d'urgence",
  "es": "Tarjeta de emergencia",
  "tr": "Acil durum kartı",
  "ar": "بطاقة الطوارئ"
 },
 "emergency_meds_title": {
  "nl": "Huidige medicatie",
  "en": "Current medication",
  "de": "Aktuelle Medikamente",
  "fr": "Médicaments actuels",
  "es": "Medicación actual",
  "tr": "Güncel ilaçlar",
  "ar": "الأدوية الحالية"
 },
 "emergency_no_meds": {
  "nl": "Nog geen medicatie toegevoegd.",
  "en": "No medication added yet.",
  "de": "Noch keine Medikamente hinzugefügt.",
  "fr": "Aucun médicament ajouté pour l'instant.",
  "es": "Aún no se ha añadido medicación.",
  "tr": "Henüz ilaç eklenmedi.",
  "ar": "لم تتم إضافة أي دواء بعد."
 },
 "emergency_contacts_title": {
  "nl": "Contacten",
  "en": "Contacts",
  "de": "Kontakte",
  "fr": "Contacts",
  "es": "Contactos",
  "tr": "Kişiler",
  "ar": "جهات الاتصال"
 },
 "emergency_no_contacts": {
  "nl": "Nog geen contactgegevens ingevuld — dat kan bij Instellingen → Noodinformatie.",
  "en": "No contact details filled in yet — you can do that under Settings → Emergency information.",
  "de": "Noch keine Kontaktdaten eingetragen — das kannst du unter Einstellungen → Notfallinformationen erledigen.",
  "fr": "Aucune coordonnée renseignée pour l'instant — tu peux le faire dans Paramètres → Informations d'urgence.",
  "es": "Aún no se han introducido datos de contacto — puedes hacerlo en Ajustes → Información de emergencia.",
  "tr": "Henüz iletişim bilgisi girilmedi — bunu Ayarlar → Acil durum bilgileri altından yapabilirsin.",
  "ar": "لم يتم إدخال بيانات تواصل بعد — يمكنك القيام بذلك من الإعدادات ← معلومات الطوارئ."
 },
 "emergency_contact_label": {
  "nl": "Noodcontact",
  "en": "Emergency contact",
  "de": "Notfallkontakt",
  "fr": "Contact d'urgence",
  "es": "Contacto de emergencia",
  "tr": "Acil durum kişisi",
  "ar": "جهة اتصال الطوارئ"
 },
 "emergency_doctor_label": {
  "nl": "Huisarts",
  "en": "GP",
  "de": "Hausarzt",
  "fr": "Médecin traitant",
  "es": "Médico de cabecera",
  "tr": "Aile hekimi",
  "ar": "طبيب الأسرة"
 },
 "emergency_pharmacy_label": {
  "nl": "Apotheek",
  "en": "Pharmacy",
  "de": "Apotheke",
  "fr": "Pharmacie",
  "es": "Farmacia",
  "tr": "Eczane",
  "ar": "الصيدلية"
 },
 "onboarding_step1_title": {
  "nl": "Vandaag",
  "en": "Today",
  "de": "Heute",
  "fr": "Aujourd'hui",
  "es": "Hoy",
  "tr": "Bugün",
  "ar": "اليوم"
 },
 "onboarding_step1_body": {
  "nl": "Hier tik je je potjes aan zodra je je medicatie hebt genomen. Dit is je startpagina — hier open je de app negen van de tien keer voor.",
  "en": "This is where you tap your doses once you've taken your medication. It's your home page — the one you'll open nine times out of ten.",
  "de": "Hier tippst du deine Dosen an, sobald du dein Medikament genommen hast. Das ist deine Startseite — die, die du neunmal von zehn öffnest.",
  "fr": "C'est ici que tu coches tes doses une fois ton médicament pris. C'est ta page d'accueil — celle que tu ouvriras neuf fois sur dix.",
  "es": "Aquí es donde marcas tus dosis en cuanto tomas tu medicación. Es tu página principal — la que abrirás nueve de cada diez veces.",
  "tr": "İlacını aldıktan sonra dozlarını buradan işaretlersin. Burası ana sayfan — on seferden dokuzunda buraya gireceksin.",
  "ar": "هنا تنقر على جرعاتك بمجرد تناول دوائك. هذه هي صفحتك الرئيسية — الصفحة التي ستفتحها تسع مرات من كل عشر."
 },
 "onboarding_step2_title": {
  "nl": "Week",
  "en": "Week",
  "de": "Woche",
  "fr": "Semaine",
  "es": "Semana",
  "tr": "Hafta",
  "ar": "الأسبوع"
 },
 "onboarding_step2_body": {
  "nl": "Bekijk per dag wat je hebt genomen en wat je hebt gemist, en blader terug naar vorige weken.",
  "en": "See day by day what you've taken and what you've missed, and page back through previous weeks.",
  "de": "Sieh Tag für Tag, was du genommen und was du verpasst hast, und blättere durch frühere Wochen zurück.",
  "fr": "Consulte jour par jour ce que tu as pris et ce que tu as manqué, et navigue dans les semaines précédentes.",
  "es": "Consulta día a día lo que has tomado y lo que has olvidado, y navega por semanas anteriores.",
  "tr": "Gün gün neyi aldığını ve neyi kaçırdığını gör, önceki haftalara geri dön.",
  "ar": "اطّلع يومًا بيوم على ما تناولته وما فاتك، وتصفّح الأسابيع السابقة."
 },
 "onboarding_step3_title": {
  "nl": "Beheer",
  "en": "Manage",
  "de": "Verwalten",
  "fr": "Gérer",
  "es": "Gestionar",
  "tr": "Yönet",
  "ar": "الإدارة"
 },
 "onboarding_step3_body": {
  "nl": "Voeg medicatie toe, pas doses aan, of vul je voorraad bij zodra er een nieuwe verpakking bij komt.",
  "en": "Add medication, adjust doses, or restock as soon as a new package arrives.",
  "de": "Füge Medikamente hinzu, passe Dosen an oder fülle den Vorrat auf, sobald eine neue Packung ankommt.",
  "fr": "Ajoute des médicaments, ajuste les doses, ou réapprovisionne dès qu'une nouvelle boîte arrive.",
  "es": "Añade medicación, ajusta las dosis o repone existencias en cuanto llegue un envase nuevo.",
  "tr": "İlaç ekle, dozları ayarla veya yeni bir paket geldiğinde stok ekle.",
  "ar": "أضف دواءً، أو عدّل الجرعات، أو جدّد المخزون بمجرد وصول عبوة جديدة."
 },
 "onboarding_step4_title": {
  "nl": "Instellingen",
  "en": "Settings",
  "de": "Einstellungen",
  "fr": "Paramètres",
  "es": "Ajustes",
  "tr": "Ayarlar",
  "ar": "الإعدادات"
 },
 "onboarding_step4_body": {
  "nl": "Meldingen, een back-up maken, en je noodkaart met belangrijke gegevens.",
  "en": "Notifications, making a backup, and your emergency card with important details.",
  "de": "Benachrichtigungen, ein Backup erstellen, und deine Notfallkarte mit wichtigen Daten.",
  "fr": "Notifications, création d'une sauvegarde, et ta carte d'urgence avec les détails importants.",
  "es": "Notificaciones, hacer una copia de seguridad, y tu tarjeta de emergencia con datos importantes.",
  "tr": "Bildirimler, yedek alma, ve önemli bilgileri içeren acil durum kartın.",
  "ar": "الإشعارات، إنشاء نسخة احتياطية، وبطاقة الطوارئ الخاصة بك التي تحتوي على التفاصيل المهمة."
 },
 "onboarding_skip": {
  "nl": "Overslaan",
  "en": "Skip",
  "de": "Überspringen",
  "fr": "Passer",
  "es": "Omitir",
  "tr": "Atla",
  "ar": "تخطي"
 },
 "onboarding_next": {
  "nl": "Volgende",
  "en": "Next",
  "de": "Weiter",
  "fr": "Suivant",
  "es": "Siguiente",
  "tr": "İleri",
  "ar": "التالي"
 },
 "onboarding_done": {
  "nl": "Aan de slag",
  "en": "Get started",
  "de": "Los geht's",
  "fr": "Commencer",
  "es": "Empezar",
  "tr": "Başla",
  "ar": "ابدأ الآن"
 },
 "restock_title": {
  "nl": "Voorraad aanvullen",
  "en": "Restock",
  "de": "Auffüllen",
  "fr": "Réapprovisionner",
  "es": "Reponer",
  "tr": "Stok ekle",
  "ar": "تجديد المخزون"
 },
 "restock_current": {
  "nl": "huidige voorraad:",
  "en": "current stock:",
  "de": "aktueller Vorrat:",
  "fr": "stock actuel :",
  "es": "existencias actuales:",
  "tr": "mevcut stok:",
  "ar": "المخزون الحالي:"
 },
 "restock_field_label": {
  "nl": "Nieuwe voorraad die erbij komt ({unit})",
  "en": "New stock being added ({unit})",
  "de": "Neuer Vorrat, der hinzukommt ({unit})",
  "fr": "Nouveau stock ajouté ({unit})",
  "es": "Nuevas existencias que se añaden ({unit})",
  "tr": "Eklenecek yeni stok ({unit})",
  "ar": "المخزون الجديد المُضاف ({unit})"
 },
 "restock_placeholder": {
  "nl": "bijv. 300",
  "en": "e.g. 300",
  "de": "z. B. 300",
  "fr": "ex. 300",
  "es": "p. ej. 300",
  "tr": "örn. 300",
  "ar": "مثال: 300"
 },
 "restock_new_total": {
  "nl": "Nieuw totaal wordt: {n} {unit}",
  "en": "New total will be: {n} {unit}",
  "de": "Neue Gesamtmenge: {n} {unit}",
  "fr": "Nouveau total : {n} {unit}",
  "es": "El nuevo total será: {n} {unit}",
  "tr": "Yeni toplam: {n} {unit}",
  "ar": "سيصبح الإجمالي الجديد: {n} {unit}"
 },
 "restock_prompt": {
  "nl": "Vul aan hoeveel je erbij hebt gekregen.",
  "en": "Fill in how much you've received.",
  "de": "Trage ein, wie viel du erhalten hast.",
  "fr": "Indique la quantité reçue.",
  "es": "Indica cuánto has recibido.",
  "tr": "Ne kadar aldığını gir.",
  "ar": "أدخل الكمية التي استلمتها."
 },
 "common_cancel": {
  "nl": "Annuleren",
  "en": "Cancel",
  "de": "Abbrechen",
  "fr": "Annuler",
  "es": "Cancelar",
  "tr": "İptal",
  "ar": "إلغاء"
 },
 "common_save": {
  "nl": "Opslaan",
  "en": "Save",
  "de": "Speichern",
  "fr": "Enregistrer",
  "es": "Guardar",
  "tr": "Kaydet",
  "ar": "حفظ"
 },
 "profile_default_name": {
  "nl": "Ik",
  "en": "Me",
  "de": "Ich",
  "fr": "Moi",
  "es": "Yo",
  "tr": "Ben",
  "ar": "أنا"
 },
 "profiles_title": {
  "nl": "Profielen",
  "en": "Profiles",
  "de": "Profile",
  "fr": "Profils",
  "es": "Perfiles",
  "tr": "Profiller",
  "ar": "الملفات الشخصية"
 },
 "profiles_manage_explain": {
  "nl": "Beheer meerdere mensen in dezelfde MedBox — elk profiel heeft zijn eigen medicatie en geschiedenis.",
  "en": "Manage several people in the same MedBox — each profile has its own medication and history.",
  "de": "Verwalte mehrere Personen in derselben MedBox — jedes Profil hat seine eigene Medikation und Historie.",
  "fr": "Gère plusieurs personnes dans la même MedBox — chaque profil a ses propres médicaments et son propre historique.",
  "es": "Gestiona a varias personas en la misma MedBox — cada perfil tiene su propia medicación e historial.",
  "tr": "Aynı MedBox içinde birden fazla kişiyi yönet — her profilin kendi ilaçları ve geçmişi vardır.",
  "ar": "أدر عدّة أشخاص في نفس الـ MedBox — لكل ملف شخصي أدويته وسجلّه الخاص."
 },
 "profiles_active_badge": {
  "nl": "Actief",
  "en": "Active",
  "de": "Aktiv",
  "fr": "Actif",
  "es": "Activo",
  "tr": "Aktif",
  "ar": "نشِط"
 },
 "profiles_add_button": {
  "nl": "+ Nieuw profiel",
  "en": "+ New profile",
  "de": "+ Neues Profil",
  "fr": "+ Nouveau profil",
  "es": "+ Nuevo perfil",
  "tr": "+ Yeni profil",
  "ar": "+ ملف شخصي جديد"
 },
 "profiles_name_placeholder": {
  "nl": "Bijv. Mama",
  "en": "E.g. Mom",
  "de": "Z. B. Mama",
  "fr": "Ex. Maman",
  "es": "P. ej. Mamá",
  "tr": "Örn. Anne",
  "ar": "مثال: أمي"
 },
 "profiles_rename_title": {
  "nl": "Profiel hernoemen",
  "en": "Rename profile",
  "de": "Profil umbenennen",
  "fr": "Renommer le profil",
  "es": "Renombrar perfil",
  "tr": "Profili yeniden adlandır",
  "ar": "إعادة تسمية الملف الشخصي"
 },
 "profiles_delete_confirm": {
  "nl": "Dit profiel verwijderen? Alle medicatie en geschiedenis van dit profiel gaan mee verloren.",
  "en": "Delete this profile? All medication and history for this profile will be lost too.",
  "de": "Dieses Profil löschen? Alle Medikation und Historie dieses Profils gehen ebenfalls verloren.",
  "fr": "Supprimer ce profil ? Tous les médicaments et l'historique de ce profil seront perdus aussi.",
  "es": "¿Eliminar este perfil? También se perderán toda la medicación y el historial de este perfil.",
  "tr": "Bu profil silinsin mi? Bu profile ait tüm ilaçlar ve geçmiş de kaybolacak.",
  "ar": "حذف هذا الملف الشخصي؟ ستُفقد أيضًا كل الأدوية والسجلّ الخاصّان بهذا الملف."
 },
 "profiles_delete_last_blocked": {
  "nl": "Je kunt het laatste profiel niet verwijderen.",
  "en": "You can't delete the last profile.",
  "de": "Du kannst das letzte Profil nicht löschen.",
  "fr": "Tu ne peux pas supprimer le dernier profil.",
  "es": "No puedes eliminar el último perfil.",
  "tr": "Son profili silemezsin.",
  "ar": "لا يمكنك حذف آخر ملف شخصي."
 },
 "settings_profiles_manage_button": {
  "nl": "Profielen beheren",
  "en": "Manage profiles",
  "de": "Profile verwalten",
  "fr": "Gérer les profils",
  "es": "Gestionar perfiles",
  "tr": "Profilleri yönet",
  "ar": "إدارة الملفات الشخصية"
 },
 "restock_add": {
  "nl": "Toevoegen",
  "en": "Add",
  "de": "Hinzufügen",
  "fr": "Ajouter",
  "es": "Añadir",
  "tr": "Ekle",
  "ar": "إضافة"
 },
 "leaflet_loading": {
  "nl": "Bijsluiterinformatie laden…",
  "en": "Loading leaflet information…",
  "de": "Beipackzettel-Informationen werden geladen…",
  "fr": "Chargement des informations de la notice…",
  "es": "Cargando información del prospecto…",
  "tr": "Prospektüs bilgileri yükleniyor…",
  "ar": "جارٍ تحميل معلومات النشرة…"
 },
 "leaflet_fetch_failed": {
  "nl": "Kon geen informatie ophalen.",
  "en": "Couldn't retrieve information.",
  "de": "Informationen konnten nicht abgerufen werden.",
  "fr": "Impossible de récupérer les informations.",
  "es": "No se pudo obtener la información.",
  "tr": "Bilgi alınamadı.",
  "ar": "تعذّر جلب المعلومات."
 },
 "leaflet_retry": {
  "nl": "Opnieuw proberen",
  "en": "Try again",
  "de": "Erneut versuchen",
  "fr": "Réessayer",
  "es": "Volver a intentarlo",
  "tr": "Tekrar dene",
  "ar": "أعد المحاولة"
 },
 "leaflet_use": {
  "nl": "Gebruik",
  "en": "Use",
  "de": "Verwenden",
  "fr": "Utiliser",
  "es": "Usar",
  "tr": "Kullan",
  "ar": "استخدام"
 },
 "leaflet_dosage": {
  "nl": "Gebruikelijke dosering",
  "en": "Usual dosage",
  "de": "Übliche Dosierung",
  "fr": "Posologie habituelle",
  "es": "Dosis habitual",
  "tr": "Olağan doz",
  "ar": "الجرعة المعتادة"
 },
 "leaflet_side_effects": {
  "nl": "Veelvoorkomende bijwerkingen",
  "en": "Common side effects",
  "de": "Häufige Nebenwirkungen",
  "fr": "Effets secondaires courants",
  "es": "Efectos secundarios frecuentes",
  "tr": "Yaygın yan etkiler",
  "ar": "الآثار الجانبية الشائعة"
 },
 "leaflet_warning": {
  "nl": "Let op",
  "en": "Caution",
  "de": "Achtung",
  "fr": "Attention",
  "es": "Precaución",
  "tr": "Dikkat",
  "ar": "تنبيه"
 },
 "leaflet_disclaimer": {
  "nl": "Algemene informatie, geen vervanging voor de officiële bijsluiter of het advies van je arts of apotheker.",
  "en": "General information, not a substitute for the official leaflet or advice from your doctor or pharmacist.",
  "de": "Allgemeine Informationen, kein Ersatz für den offiziellen Beipackzettel oder den Rat deines Arztes oder Apothekers.",
  "fr": "Informations générales, ne remplace pas la notice officielle ni l'avis de ton médecin ou pharmacien.",
  "es": "Información general, no sustituye al prospecto oficial ni al consejo de tu médico o farmacéutico.",
  "tr": "Genel bilgidir, resmi prospektüsün veya doktorunun ya da eczacının tavsiyesinin yerini tutmaz.",
  "ar": "معلومات عامة، ولا تُغني عن النشرة الرسمية أو نصيحة طبيبك أو الصيدلي."
 },
 "leaflet_official_link": {
  "nl": "Officiële bijsluiter bekijken",
  "en": "View official leaflet",
  "de": "Offiziellen Beipackzettel ansehen",
  "fr": "Voir la notice officielle",
  "es": "Ver el prospecto oficial",
  "tr": "Resmi prospektüsü görüntüle",
  "ar": "عرض النشرة الرسمية"
 },
 "leaflet_fetch_button": {
  "nl": "Bijsluiter ophalen",
  "en": "Fetch leaflet",
  "de": "Beipackzettel abrufen",
  "fr": "Récupérer la notice",
  "es": "Obtener prospecto",
  "tr": "Prospektüsü getir",
  "ar": "جلب النشرة"
 },
 "medmodal_edit_title": {
  "nl": "Medicijn bewerken",
  "en": "Edit medication",
  "de": "Medikament bearbeiten",
  "fr": "Modifier le médicament",
  "es": "Editar medicación",
  "tr": "İlacı düzenle",
  "ar": "تعديل الدواء"
 },
 "medmodal_add_title": {
  "nl": "Medicijn toevoegen",
  "en": "Add medication",
  "de": "Medikament hinzufügen",
  "fr": "Ajouter un médicament",
  "es": "Añadir medicamento",
  "tr": "İlaç ekle",
  "ar": "إضافة دواء"
 },
 "field_name": {
  "nl": "Naam",
  "en": "Name",
  "de": "Name",
  "fr": "Nom",
  "es": "Nombre",
  "tr": "Ad",
  "ar": "الاسم"
 },
 "field_name_placeholder2": {
  "nl": "Bijv. Metoprolol",
  "en": "E.g. Metoprolol",
  "de": "Z. B. Metoprolol",
  "fr": "Ex. Métoprolol",
  "es": "P. ej. Metoprolol",
  "tr": "Örn. Metoprolol",
  "ar": "مثال: ميتوبرولول"
 },
 "field_frequency": {
  "nl": "Hoe vaak neem je dit in?",
  "en": "How often do you take this?",
  "de": "Wie oft nimmst du das ein?",
  "fr": "À quelle fréquence le prends-tu ?",
  "es": "¿Con qué frecuencia lo tomas?",
  "tr": "Bunu ne sıklıkla alıyorsun?",
  "ar": "كم مرة تتناول هذا الدواء؟"
 },
 "freq_daily": {
  "nl": "Dagelijks",
  "en": "Daily",
  "de": "Täglich",
  "fr": "Quotidien",
  "es": "Diario",
  "tr": "Günlük",
  "ar": "يوميًا"
 },
 "freq_fixed_days": {
  "nl": "Vaste dagen",
  "en": "Fixed days",
  "de": "Feste Tage",
  "fr": "Jours fixes",
  "es": "Días fijos",
  "tr": "Sabit günler",
  "ar": "أيام محددة"
 },
 "freq_prn": {
  "nl": "Indien nodig",
  "en": "As needed",
  "de": "Bei Bedarf",
  "fr": "Au besoin",
  "es": "Si es necesario",
  "tr": "Gerektiğinde",
  "ar": "عند الحاجة"
 },
 "weekdays_choose_one": {
  "nl": "Kies minstens één dag.",
  "en": "Choose at least one day.",
  "de": "Wähle mindestens einen Tag.",
  "fr": "Choisis au moins un jour.",
  "es": "Elige al menos un día.",
  "tr": "En az bir gün seç.",
  "ar": "اختر يومًا واحدًا على الأقل."
 },
 "prn_explain": {
  "nl": "Geen vast schema — je vinkt dit af via de knop \"Nu genomen\" op het hoofdscherm, wanneer je het nodig hebt.",
  "en": "No fixed schedule — you check this off with the \"Taken now\" button on the home screen, whenever you need it.",
  "de": "Kein fester Zeitplan — du hakst dies mit der Schaltfläche „Jetzt genommen\" auf dem Startbildschirm ab, wann immer du es brauchst.",
  "fr": "Pas d'horaire fixe — tu coches cela avec le bouton « Pris maintenant » sur l'écran d'accueil, quand tu en as besoin.",
  "es": "Sin horario fijo — lo marcas con el botón «Tomado ahora» en la pantalla principal, cuando lo necesites.",
  "tr": "Sabit bir programı yok — ihtiyaç duyduğunda ana ekrandaki \"Şimdi alındı\" düğmesiyle işaretlersin.",
  "ar": "لا يوجد جدول ثابت — تُسجّله عبر زر \"تم الآن\" في الشاشة الرئيسية، متى احتجت إليه."
 },
 "field_photo": {
  "nl": "Herkenbare afbeelding",
  "en": "Recognizable image",
  "de": "Erkennbares Bild",
  "fr": "Image reconnaissable",
  "es": "Imagen reconocible",
  "tr": "Tanınabilir görsel",
  "ar": "صورة مميزة"
 },
 "photo_auto_explain": {
  "nl": "Er wordt automatisch een herkenbaar rondje met de initialen gemaakt. Wil je liever een echte foto? Dat kan hieronder.",
  "en": "A recognizable circle with initials is created automatically. Prefer a real photo instead? You can add one below.",
  "de": "Es wird automatisch ein erkennbarer Kreis mit den Initialen erstellt. Lieber ein echtes Foto? Das kannst du unten hinzufügen.",
  "fr": "Un cercle reconnaissable avec les initiales est créé automatiquement. Tu préfères une vraie photo ? Tu peux en ajouter une ci-dessous.",
  "es": "Se crea automáticamente un círculo reconocible con las iniciales. ¿Prefieres una foto real? Puedes añadirla abajo.",
  "tr": "Otomatik olarak baş harflerle tanınabilir bir daire oluşturulur. Gerçek bir fotoğraf mı tercih edersin? Aşağıdan ekleyebilirsin.",
  "ar": "يتم إنشاء دائرة مميزة تحتوي على الأحرف الأولى تلقائيًا. تفضّل صورة حقيقية بدلًا من ذلك؟ يمكنك إضافتها أدناه."
 },
 "photo_busy": {
  "nl": "Bezig…",
  "en": "Working…",
  "de": "Wird bearbeitet…",
  "fr": "Travail en cours…",
  "es": "Procesando…",
  "tr": "İşleniyor…",
  "ar": "جارٍ العمل…"
 },
 "photo_change": {
  "nl": "Foto wijzigen",
  "en": "Change photo",
  "de": "Foto ändern",
  "fr": "Changer la photo",
  "es": "Cambiar foto",
  "tr": "Fotoğrafı değiştir",
  "ar": "تغيير الصورة"
 },
 "photo_add": {
  "nl": "Eigen foto toevoegen",
  "en": "Add your own photo",
  "de": "Eigenes Foto hinzufügen",
  "fr": "Ajouter ta propre photo",
  "es": "Añadir tu propia foto",
  "tr": "Kendi fotoğrafını ekle",
  "ar": "إضافة صورتك الخاصة"
 },
 "photo_recognize_busy": {
  "nl": "Bezig met herkennen…",
  "en": "Recognizing…",
  "de": "Wird erkannt…",
  "fr": "Reconnaissance en cours…",
  "es": "Reconociendo…",
  "tr": "Tanınıyor…",
  "ar": "جارٍ التعرّف…"
 },
 "photo_recognize": {
  "nl": "Naam herkennen uit foto",
  "en": "Recognize name from photo",
  "de": "Namen aus Foto erkennen",
  "fr": "Reconnaître le nom depuis la photo",
  "es": "Reconocer nombre desde la foto",
  "tr": "Fotoğraftan adı tanı",
  "ar": "التعرّف على الاسم من الصورة"
 },
 "photo_recognized_note": {
  "nl": "Herkend uit foto — controleer of dit klopt voordat je opslaat.",
  "en": "Recognized from photo — check that it's correct before saving.",
  "de": "Aus Foto erkannt — überprüfe, ob es stimmt, bevor du speicherst.",
  "fr": "Reconnu depuis la photo — vérifie que c'est correct avant d'enregistrer.",
  "es": "Reconocido a partir de la foto — comprueba que sea correcto antes de guardar.",
  "tr": "Fotoğraftan tanındı — kaydetmeden önce doğru olduğundan emin ol.",
  "ar": "تم التعرّف عليه من الصورة — تأكّد من صحته قبل الحفظ."
 },
 "photo_recognize_unclear": {
  "nl": "Kon de naam niet met zekerheid lezen. Vul 'm handmatig in.",
  "en": "Couldn't read the name with certainty. Please enter it manually.",
  "de": "Der Name konnte nicht eindeutig gelesen werden. Bitte gib ihn manuell ein.",
  "fr": "Impossible de lire le nom avec certitude. Merci de le saisir manuellement.",
  "es": "No se pudo leer el nombre con certeza. Introdúcelo manualmente.",
  "tr": "Ad kesin olarak okunamadı. Lütfen elle gir.",
  "ar": "تعذّرت قراءة الاسم بدقة. يُرجى إدخاله يدويًا."
 },
 "photo_recognize_failed": {
  "nl": "Herkenning is niet gelukt. Probeer een duidelijkere foto of vul de naam handmatig in.",
  "en": "Recognition failed. Try a clearer photo or enter the name manually.",
  "de": "Erkennung fehlgeschlagen. Versuche ein deutlicheres Foto oder gib den Namen manuell ein.",
  "fr": "Échec de la reconnaissance. Essaie une photo plus nette ou saisis le nom manuellement.",
  "es": "Ha fallado el reconocimiento. Prueba con una foto más clara o introduce el nombre manualmente.",
  "tr": "Tanıma başarısız oldu. Daha net bir fotoğraf dene veya adı elle gir.",
  "ar": "فشل التعرّف. جرّب صورة أوضح أو أدخل الاسم يدويًا."
 },
 "field_color": {
  "nl": "Kleur",
  "en": "Color",
  "de": "Farbe",
  "fr": "Couleur",
  "es": "Color",
  "tr": "Renk",
  "ar": "اللون"
 },
 "field_shape": {
  "nl": "Vorm",
  "en": "Form",
  "de": "Form",
  "fr": "Forme",
  "es": "Forma",
  "tr": "Şekil",
  "ar": "الشكل"
 },
 "shape_tablets": {
  "nl": "Tabletten",
  "en": "Tablets",
  "de": "Tabletten",
  "fr": "Comprimés",
  "es": "Comprimidos",
  "tr": "Tabletler",
  "ar": "أقراص"
 },
 "shape_ointment": {
  "nl": "Zalf/crème",
  "en": "Ointment/cream",
  "de": "Salbe/Creme",
  "fr": "Pommade/crème",
  "es": "Pomada/crema",
  "tr": "Merhem/krem",
  "ar": "مرهم/كريم"
 },
 "shape_drops": {
  "nl": "Druppels",
  "en": "Drops",
  "de": "Tropfen",
  "fr": "Gouttes",
  "es": "Gotas",
  "tr": "Damla",
  "ar": "قطرات"
 },
 "shape_other": {
  "nl": "Overig",
  "en": "Other",
  "de": "Sonstige",
  "fr": "Autre",
  "es": "Otro",
  "tr": "Diğer",
  "ar": "أخرى"
 },
 "shape_other_placeholder": {
  "nl": "eenheid, bijv. druppels",
  "en": "unit, e.g. drops",
  "de": "Einheit, z. B. Tropfen",
  "fr": "unité, ex. gouttes",
  "es": "unidad, p. ej. gotas",
  "tr": "birim, örn. damla",
  "ar": "الوحدة، مثال: قطرات"
 },
 "field_daily_dose": {
  "nl": "Dagdosering",
  "en": "Daily dose",
  "de": "Tagesdosis",
  "fr": "Dose journalière",
  "es": "Dosis diaria",
  "tr": "Günlük doz",
  "ar": "الجرعة اليومية"
 },
 "daily_dose_placeholder": {
  "nl": "totaal per dag",
  "en": "total per day",
  "de": "gesamt pro Tag",
  "fr": "total par jour",
  "es": "total al día",
  "tr": "günlük toplam",
  "ar": "الإجمالي يوميًا"
 },
 "daily_dose_missing": {
  "nl": "Vul in hoeveel {unit} er totaal per dag horen — zo weet de app hoeveel er verdeeld moet worden.",
  "en": "Fill in the total number of {unit} per day — that way the app knows how much to divide up.",
  "de": "Gib die Gesamtzahl an {unit} pro Tag ein — so weiß die App, wie viel sie aufteilen muss.",
  "fr": "Indique le nombre total de {unit} par jour — l'appli saura ainsi combien répartir.",
  "es": "Indica el número total de {unit} al día — así la app sabrá cuánto repartir.",
  "tr": "Günde toplam kaç {unit} olduğunu gir — böylece uygulama ne kadar dağıtacağını bilir.",
  "ar": "أدخل العدد الإجمالي لِـ {unit} يوميًا — بذلك يعرف التطبيق كيفية توزيعها."
 },
 "daily_dose_distributed": {
  "nl": "Verdeeld over de dagdelen: {a} van {b} {unit}",
  "en": "Distributed across periods: {a} of {b} {unit}",
  "de": "Auf die Tagesabschnitte verteilt: {a} von {b} {unit}",
  "fr": "Réparti sur les périodes : {a} sur {b} {unit}",
  "es": "Repartido entre las franjas: {a} de {b} {unit}",
  "tr": "Gün dilimlerine dağıtıldı: {b} {unit} üzerinden {a}",
  "ar": "موزّعة على الفترات: {a} من {b} {unit}"
 },
 "field_strength": {
  "nl": "Sterkte per {unit}",
  "en": "Strength per {unit}",
  "de": "Stärke pro {unit}",
  "fr": "Dosage par {unit}",
  "es": "Concentración por {unit}",
  "tr": "{unit} başına güç",
  "ar": "التركيز لكل {unit}"
 },
 "strength_mg_placeholder": {
  "nl": "bijv. 500",
  "en": "e.g. 500",
  "de": "z. B. 500",
  "fr": "ex. 500",
  "es": "p. ej. 500",
  "tr": "örn. 500",
  "ar": "مثال: 500"
 },
 "strength_other_placeholder": {
  "nl": "bijv. 10ml, 1 druppel, 2,5%, 1 puf",
  "en": "e.g. 10ml, 1 drop, 2.5%, 1 puff",
  "de": "z. B. 10 ml, 1 Tropfen, 2,5 %, 1 Hub",
  "fr": "ex. 10 ml, 1 goutte, 2,5 %, 1 bouffée",
  "es": "p. ej. 10 ml, 1 gota, 2,5 %, 1 inhalación",
  "tr": "örn. 10 ml, 1 damla, %2,5, 1 püskürtme",
  "ar": "مثال: 10 مل، قطرة واحدة، 2.5٪، بخة واحدة"
 },
 "strength_missing": {
  "nl": "Vul de sterkte in — medicatie heeft altijd een dosering, dus dit veld mag niet leeg blijven.",
  "en": "Fill in the strength — medication always has a dosage, so this field can't be left empty.",
  "de": "Gib die Stärke ein — Medikamente haben immer eine Dosierung, daher darf dieses Feld nicht leer bleiben.",
  "fr": "Indique le dosage — un médicament a toujours une posologie, ce champ ne peut donc pas rester vide.",
  "es": "Indica la concentración — la medicación siempre tiene una dosis, así que este campo no puede quedar vacío.",
  "tr": "Gücü gir — ilaçların her zaman bir dozu vardır, bu yüzden bu alan boş bırakılamaz.",
  "ar": "أدخل التركيز — للدواء دائمًا جرعة محددة، لذا لا يمكن ترك هذا الحقل فارغًا."
 },
 "field_moments": {
  "nl": "Innamemomenten — vaste tijd, of na een maaltijd",
  "en": "Dose times — fixed time, or after a meal",
  "de": "Einnahmezeiten — feste Uhrzeit oder nach einer Mahlzeit",
  "fr": "Heures de prise — heure fixe ou après un repas",
  "es": "Horas de toma — hora fija o después de una comida",
  "tr": "Doz zamanları — sabit saat veya yemekten sonra",
  "ar": "أوقات الجرعات — وقت ثابت أو بعد وجبة"
 },
 "moments_note_placeholder": {
  "nl": "notitie (optioneel)",
  "en": "note (optional)",
  "de": "Notiz (optional)",
  "fr": "note (facultatif)",
  "es": "nota (opcional)",
  "tr": "not (isteğe bağlı)",
  "ar": "ملاحظة (اختياري)"
 },
 "moments_hidden_time_one": {
  "nl": "vaste tijd",
  "en": "fixed time",
  "de": "feste Uhrzeit",
  "fr": "heure fixe",
  "es": "hora fija",
  "tr": "sabit saat",
  "ar": "وقت ثابت"
 },
 "moments_hidden_time_other": {
  "nl": "vaste tijden",
  "en": "fixed times",
  "de": "feste Uhrzeiten",
  "fr": "heures fixes",
  "es": "horas fijas",
  "tr": "sabit saat",
  "ar": "أوقات ثابتة"
 },
 "moments_hidden_meal_one": {
  "nl": "na-maaltijd-moment",
  "en": "after-meal moment",
  "de": "Nach-Mahlzeit-Moment",
  "fr": "moment après repas",
  "es": "momento después de la comida",
  "tr": "yemek sonrası an",
  "ar": "لحظة بعد الوجبة"
 },
 "moments_hidden_meal_other": {
  "nl": "na-maaltijd-momenten",
  "en": "after-meal moments",
  "de": "Nach-Mahlzeit-Momente",
  "fr": "moments après repas",
  "es": "momentos después de la comida",
  "tr": "yemek sonrası anlar",
  "ar": "لحظات بعد الوجبة"
 },
 "moments_hidden_prefix": {
  "nl": "+ {n} {label} verborgen — tik op \"{tabLabel}\" om te tonen",
  "en": "+ {n} {label} hidden — tap \"{tabLabel}\" to show",
  "de": "+ {n} {label} ausgeblendet — tippe auf „{tabLabel}\", um sie anzuzeigen",
  "fr": "+ {n} {label} masqué(s) — appuie sur « {tabLabel} » pour afficher",
  "es": "+ {n} {label} ocultos — toca «{tabLabel}» para mostrar",
  "tr": "+ {n} {label} gizli — göstermek için \"{tabLabel}\" öğesine dokun",
  "ar": "+ {n} {label} مخفية — اضغط على \"{tabLabel}\" للعرض"
 },
 "moments_at_max": {
  "nl": "Je hebt je volledige dagdosering van {n} {unit} al verdeeld over de momenten hierboven. Verwijder eerst een moment, of verhoog het totaal bij \"Dagdosering\", om er nog een toe te voegen.",
  "en": "You've already distributed your full daily dose of {n} {unit} across the moments above. Remove a moment first, or raise the total under \"Daily dose\", to add another one.",
  "de": "Du hast deine gesamte Tagesdosis von {n} {unit} bereits auf die obigen Momente verteilt. Entferne zuerst einen Moment oder erhöhe die Gesamtmenge unter „Tagesdosis\", um einen weiteren hinzuzufügen.",
  "fr": "Tu as déjà réparti ta dose journalière complète de {n} {unit} sur les moments ci-dessus. Supprime d'abord un moment, ou augmente le total dans « Dose journalière », pour en ajouter un autre.",
  "es": "Ya has repartido tu dosis diaria completa de {n} {unit} entre los momentos anteriores. Elimina primero un momento, o aumenta el total en «Dosis diaria», para añadir otro.",
  "tr": "{n} {unit}'lik tüm günlük dozunu zaten yukarıdaki anlara dağıttın. Bir tane daha eklemek için önce bir anı kaldır veya \"Günlük doz\" altındaki toplamı artır.",
  "ar": "لقد وزّعت بالفعل جرعتك اليومية الكاملة البالغة {n} {unit} على اللحظات أعلاه. احذف لحظة أولًا، أو ارفع الإجمالي ضمن \"الجرعة اليومية\"، لإضافة لحظة أخرى."
 },
 "moment_fixed_time": {
  "nl": "Vaste tijd",
  "en": "Fixed time",
  "de": "Feste Uhrzeit",
  "fr": "Heure fixe",
  "es": "Hora fija",
  "tr": "Sabit saat",
  "ar": "وقت ثابت"
 },
 "moment_after_meal": {
  "nl": "Na maaltijd",
  "en": "After meal",
  "de": "Nach der Mahlzeit",
  "fr": "Après le repas",
  "es": "Después de la comida",
  "tr": "Yemekten sonra",
  "ar": "بعد الوجبة"
 },
 "moments_all_meals_set": {
  "nl": "Ontbijt, lunch en diner zijn al ingesteld — je kunt elk maaltijdmoment maar één keer toevoegen. Pas het aantal aan als er meer van dit medicijn bij hoort.",
  "en": "Breakfast, lunch and dinner are already set — each meal moment can only be added once. Adjust the count if more of this medication belongs there.",
  "de": "Frühstück, Mittag- und Abendessen sind bereits eingestellt — jeder Mahlzeit-Moment kann nur einmal hinzugefügt werden. Passe die Anzahl an, wenn mehr von diesem Medikament dorthin gehört.",
  "fr": "Le petit-déjeuner, le déjeuner et le dîner sont déjà configurés — chaque moment de repas ne peut être ajouté qu'une seule fois. Ajuste la quantité si davantage de ce médicament doit y figurer.",
  "es": "El desayuno, la comida y la cena ya están configurados — cada momento de comida solo se puede añadir una vez. Ajusta la cantidad si corresponde más de este medicamento ahí.",
  "tr": "Kahvaltı, öğle ve akşam yemeği zaten ayarlandı — her yemek anı yalnızca bir kez eklenebilir. Bu ilaçtan orada daha fazlası gerekiyorsa sayıyı ayarla.",
  "ar": "تم بالفعل ضبط الفطور والغداء والعشاء — يمكن إضافة كل لحظة وجبة مرة واحدة فقط. عدّل العدد إذا كانت هناك كمية إضافية من هذا الدواء تخصّ تلك اللحظة."
 },
 "moments_meal_hint": {
  "nl": "Handig als het innamemoment per dag verschilt. Je krijgt automatisch een melding zodra het dagdeel voorbij is als dit nog niet is afgevinkt.",
  "en": "Handy when the dose time varies by day. You'll automatically get a reminder once that period ends if this isn't checked off yet.",
  "de": "Praktisch, wenn die Einnahmezeit von Tag zu Tag variiert. Du bekommst automatisch eine Erinnerung, sobald dieser Tagesabschnitt endet, falls es noch nicht abgehakt ist.",
  "fr": "Pratique quand l'heure de prise varie selon les jours. Tu recevras automatiquement un rappel dès la fin de cette période si ce n'est pas encore coché.",
  "es": "Útil cuando la hora de toma varía según el día. Recibirás automáticamente un recordatorio en cuanto termine esa franja si todavía no lo has marcado.",
  "tr": "Doz zamanı güne göre değiştiğinde kullanışlıdır. Henüz işaretlenmediyse o dilim sona erdiğinde otomatik olarak bir hatırlatma alırsın.",
  "ar": "مفيدة عندما يختلف وقت الجرعة من يوم لآخر. ستتلقى تذكيرًا تلقائيًا بمجرد انتهاء تلك الفترة إذا لم يتم تسجيلها بعد."
 },
 "field_prn_amount": {
  "nl": "Hoeveel neem je per keer?",
  "en": "How much do you take at a time?",
  "de": "Wie viel nimmst du auf einmal?",
  "fr": "Quelle quantité prends-tu à chaque fois ?",
  "es": "¿Cuánto tomas cada vez?",
  "tr": "Bir seferde ne kadar alıyorsun?",
  "ar": "كم تتناول في كل مرة؟"
 },
 "prn_amount_placeholder": {
  "nl": "bijv. 1",
  "en": "e.g. 1",
  "de": "z. B. 1",
  "fr": "ex. 1",
  "es": "p. ej. 1",
  "tr": "örn. 1",
  "ar": "مثال: 1"
 },
 "field_count_short": {
  "nl": "aantal",
  "en": "amount",
  "de": "Anzahl",
  "fr": "quantité",
  "es": "cantidad",
  "tr": "miktar",
  "ar": "الكمية"
 },
 "unit_generic_singular": {
  "nl": "eenheid",
  "en": "unit",
  "de": "Einheit",
  "fr": "unité",
  "es": "unidad",
  "tr": "birim",
  "ar": "وحدة"
 },
 "field_stock": {
  "nl": "Voorraad (aantal, optioneel)",
  "en": "Stock (amount, optional)",
  "de": "Vorrat (Anzahl, optional)",
  "fr": "Stock (quantité, facultatif)",
  "es": "Existencias (cantidad, opcional)",
  "tr": "Stok (miktar, isteğe bağlı)",
  "ar": "المخزون (الكمية، اختياري)"
 },
 "stock_placeholder": {
  "nl": "bijv. 90",
  "en": "e.g. 90",
  "de": "z. B. 90",
  "fr": "ex. 90",
  "es": "p. ej. 90",
  "tr": "örn. 90",
  "ar": "مثال: 90"
 },
 "stock_prn_note": {
  "nl": "Bij \"indien nodig\" kan de app niet voorspellen hoeveel dagen de voorraad meegaat — je ziet alleen het aantal in stuks.",
  "en": "For \"as needed\" medication the app can't predict how many days the stock will last — you'll just see the count in units.",
  "de": "Bei „bei Bedarf\"-Medikamenten kann die App nicht vorhersagen, wie viele Tage der Vorrat reicht — du siehst nur die Anzahl in Einheiten.",
  "fr": "Pour un médicament « au besoin », l'appli ne peut pas prédire combien de jours le stock durera — tu verras juste le nombre en unités.",
  "es": "Para medicación «si es necesario» la app no puede predecir cuántos días durarán las existencias — solo verás el recuento en unidades.",
  "tr": "\"Gerektiğinde\" alınan ilaçlarda uygulama stokun kaç gün süreceğini tahmin edemez — sadece birim sayısını görürsün.",
  "ar": "بالنسبة لدواء \"عند الحاجة\" لا يستطيع التطبيق توقّع عدد الأيام التي سيدوم فيها المخزون — سترى فقط العدد بالوحدات."
 },
 "stock_auto_warn": {
  "nl": "Waarschuwing gaat automatisch aan bij {n} {unit} — dat is {days} dagen × {perday}/dag.",
  "en": "A warning turns on automatically at {n} {unit} — that's {days} days × {perday}/day.",
  "de": "Eine Warnung wird automatisch bei {n} {unit} aktiviert — das sind {days} Tage × {perday}/Tag.",
  "fr": "Une alerte s'active automatiquement à {n} {unit} — soit {days} jours × {perday}/jour.",
  "es": "Se activa automáticamente un aviso a {n} {unit} — eso son {days} días × {perday}/día.",
  "tr": "{n} {unit} seviyesinde otomatik olarak bir uyarı açılır — bu {days} gün × günde {perday} demektir.",
  "ar": "يتم تفعيل تحذير تلقائيًا عند {n} {unit} — أي {days} أيام × {perday}/يوم."
 },
 "medmodal_save_edit": {
  "nl": "Wijzigingen opslaan",
  "en": "Save changes",
  "de": "Änderungen speichern",
  "fr": "Enregistrer les modifications",
  "es": "Guardar cambios",
  "tr": "Değişiklikleri kaydet",
  "ar": "حفظ التغييرات"
 },
 "medmodal_save_add": {
  "nl": "Toevoegen aan MedBox",
  "en": "Add to MedBox",
  "de": "Zu MedBox hinzufügen",
  "fr": "Ajouter à MedBox",
  "es": "Añadir a MedBox",
  "tr": "MedBox'a ekle",
  "ar": "إضافة إلى MedBox"
 },
 "status_taken": {
  "nl": "Genomen",
  "en": "Taken",
  "de": "Genommen",
  "fr": "Pris",
  "es": "Tomado",
  "tr": "Alındı",
  "ar": "تم التناول"
 },
 "status_missed": {
  "nl": "Gemist",
  "en": "Missed",
  "de": "Verpasst",
  "fr": "Manqué",
  "es": "Olvidado",
  "tr": "Kaçırıldı",
  "ar": "فائتة"
 },
 "status_upcoming": {
  "nl": "Nog te nemen",
  "en": "Still to take",
  "de": "Noch zu nehmen",
  "fr": "À prendre",
  "es": "Aún por tomar",
  "tr": "Alınacak",
  "ar": "لم تُؤخذ بعد"
 },
 "report_title": {
  "nl": "Maandrapport",
  "en": "Monthly report",
  "de": "Monatsbericht",
  "fr": "Rapport mensuel",
  "es": "Informe mensual",
  "tr": "Aylık rapor",
  "ar": "التقرير الشهري"
 },
 "report_print": {
  "nl": "Afdrukken / Opslaan als PDF",
  "en": "Print / Save as PDF",
  "de": "Drucken / Als PDF speichern",
  "fr": "Imprimer / Enregistrer en PDF",
  "es": "Imprimir / Guardar como PDF",
  "tr": "Yazdır / PDF olarak kaydet",
  "ar": "طباعة / حفظ كملف PDF"
 },
 "report_header": {
  "nl": "MedBox — Innamegeschiedenis {month}",
  "en": "MedBox — Dose history {month}",
  "de": "MedBox — Einnahmeverlauf {month}",
  "fr": "MedBox — Historique des prises {month}",
  "es": "MedBox — Historial de tomas {month}",
  "tr": "MedBox — Doz geçmişi {month}",
  "ar": "MedBox — سجل الجرعات {month}"
 },
 "report_generated": {
  "nl": "Gegenereerd op {date}",
  "en": "Generated on {date}",
  "de": "Erstellt am {date}",
  "fr": "Généré le {date}",
  "es": "Generado el {date}",
  "tr": "{date} tarihinde oluşturuldu",
  "ar": "تم الإنشاء في {date}"
 },
 "report_col_date": {
  "nl": "Datum",
  "en": "Date",
  "de": "Datum",
  "fr": "Date",
  "es": "Fecha",
  "tr": "Tarih",
  "ar": "التاريخ"
 },
 "report_col_moment": {
  "nl": "Moment",
  "en": "Moment",
  "de": "Moment",
  "fr": "Moment",
  "es": "Momento",
  "tr": "An",
  "ar": "اللحظة"
 },
 "report_col_med": {
  "nl": "Medicijn",
  "en": "Medication",
  "de": "Medikament",
  "fr": "Médicament",
  "es": "Medicamento",
  "tr": "İlaç",
  "ar": "الدواء"
 },
 "report_col_dose": {
  "nl": "Dosering",
  "en": "Dose",
  "de": "Dosis",
  "fr": "Dose",
  "es": "Dosis",
  "tr": "Doz",
  "ar": "الجرعة"
 },
 "report_col_status": {
  "nl": "Status",
  "en": "Status",
  "de": "Status",
  "fr": "Statut",
  "es": "Estado",
  "tr": "Durum",
  "ar": "الحالة"
 },
 "report_col_taken_at": {
  "nl": "Genomen om",
  "en": "Taken at",
  "de": "Genommen um",
  "fr": "Pris à",
  "es": "Tomado a las",
  "tr": "Alınma saati",
  "ar": "وقت التناول"
 },
 "report_empty": {
  "nl": "Nog geen geschiedenis beschikbaar voor deze maand.",
  "en": "No history available for this month yet.",
  "de": "Für diesen Monat ist noch kein Verlauf verfügbar.",
  "fr": "Aucun historique disponible pour ce mois-ci.",
  "es": "Aún no hay historial disponible para este mes.",
  "tr": "Bu ay için henüz geçmiş bilgisi yok.",
  "ar": "لا يتوفّر سجل لهذا الشهر بعد."
 },
 "report_prn_moment": {
  "nl": "Indien nodig",
  "en": "As needed",
  "de": "Bei Bedarf",
  "fr": "Au besoin",
  "es": "Si es necesario",
  "tr": "Gerektiğinde",
  "ar": "عند الحاجة"
 },
 "report_status_taken": {
  "nl": "Ingenomen",
  "en": "Taken",
  "de": "Eingenommen",
  "fr": "Pris",
  "es": "Tomado",
  "tr": "Alındı",
  "ar": "مأخوذة"
 },
 "report_status_missed": {
  "nl": "Gemist",
  "en": "Missed",
  "de": "Verpasst",
  "fr": "Manqué",
  "es": "Olvidado",
  "tr": "Kaçırıldı",
  "ar": "فائتة"
 },
 "aria_dose_taken": {
  "nl": "genomen",
  "en": "taken",
  "de": "genommen",
  "fr": "pris",
  "es": "tomado",
  "tr": "alındı",
  "ar": "تم التناول"
 },
 "aria_dose_missed": {
  "nl": "gemist",
  "en": "missed",
  "de": "verpasst",
  "fr": "manqué",
  "es": "olvidado",
  "tr": "kaçırıldı",
  "ar": "فائتة"
 },
 "aria_dose_upcoming": {
  "nl": "nog te nemen",
  "en": "still to take",
  "de": "noch zu nehmen",
  "fr": "à prendre",
  "es": "aún por tomar",
  "tr": "alınacak",
  "ar": "لم تُؤخذ بعد"
 },
 "aria_dose_label": {
  "nl": "{name}, {moment}, {status}",
  "en": "{name}, {moment}, {status}",
  "de": "{name}, {moment}, {status}",
  "fr": "{name}, {moment}, {status}",
  "es": "{name}, {moment}, {status}",
  "tr": "{name}, {moment}, {status}",
  "ar": "{name}, {moment}, {status}"
 },
 "meal_breakfast": {
  "nl": "Na het ontbijt",
  "en": "After breakfast",
  "de": "Nach dem Frühstück",
  "fr": "Après le petit-déjeuner",
  "es": "Después del desayuno",
  "tr": "Kahvaltıdan sonra",
  "ar": "بعد الفطور"
 },
 "meal_lunch": {
  "nl": "Na de lunch",
  "en": "After lunch",
  "de": "Nach dem Mittagessen",
  "fr": "Après le déjeuner",
  "es": "Después de la comida",
  "tr": "Öğle yemeğinden sonra",
  "ar": "بعد الغداء"
 },
 "meal_dinner": {
  "nl": "Na het diner",
  "en": "After dinner",
  "de": "Nach dem Abendessen",
  "fr": "Après le dîner",
  "es": "Después de la cena",
  "tr": "Akşam yemeğinden sonra",
  "ar": "بعد العشاء"
 },
 "period_ochtend": {
  "nl": "Ochtend",
  "en": "Morning",
  "de": "Morgen",
  "fr": "Matin",
  "es": "Mañana",
  "tr": "Sabah",
  "ar": "الصباح"
 },
 "period_middag": {
  "nl": "Middag",
  "en": "Afternoon",
  "de": "Nachmittag",
  "fr": "Après-midi",
  "es": "Tarde",
  "tr": "Öğleden sonra",
  "ar": "بعد الظهر"
 },
 "period_avond": {
  "nl": "Avond",
  "en": "Evening",
  "de": "Abend",
  "fr": "Soir",
  "es": "Noche",
  "tr": "Akşam",
  "ar": "المساء"
 },
 "period_nacht": {
  "nl": "Nacht",
  "en": "Night",
  "de": "Nacht",
  "fr": "Nuit",
  "es": "Madrugada",
  "tr": "Gece",
  "ar": "الليل"
 },
 "unit_tablet_singular": {
  "nl": "tablet",
  "en": "tablet",
  "de": "Tablette",
  "fr": "comprimé",
  "es": "comprimido",
  "tr": "tablet",
  "ar": "قرص"
 },
 "unit_tablet_plural": {
  "nl": "tabletten",
  "en": "tablets",
  "de": "Tabletten",
  "fr": "comprimés",
  "es": "comprimidos",
  "tr": "tablet",
  "ar": "أقراص"
 },
 "unit_other_default": {
  "nl": "stuks",
  "en": "units",
  "de": "Stück",
  "fr": "unités",
  "es": "unidades",
  "tr": "adet",
  "ar": "وحدات"
 },
 "unit_ointment_singular": {
  "nl": "toepassing",
  "en": "application",
  "de": "Anwendung",
  "fr": "application",
  "es": "aplicación",
  "tr": "uygulama",
  "ar": "استخدام"
 },
 "unit_ointment_plural": {
  "nl": "toepassingen",
  "en": "applications",
  "de": "Anwendungen",
  "fr": "applications",
  "es": "aplicaciones",
  "tr": "uygulama",
  "ar": "استخدامات"
 },
 "unit_drop_singular": {
  "nl": "druppel",
  "en": "drop",
  "de": "Tropfen",
  "fr": "goutte",
  "es": "gota",
  "tr": "damla",
  "ar": "قطرة"
 },
 "unit_drop_plural": {
  "nl": "druppels",
  "en": "drops",
  "de": "Tropfen",
  "fr": "gouttes",
  "es": "gotas",
  "tr": "damla",
  "ar": "قطرات"
 },
 "notif_dose_title": {
  "nl": "Tijd voor {name}",
  "en": "Time for {name}",
  "de": "Zeit für {name}",
  "fr": "C'est l'heure de {name}",
  "es": "Hora de {name}",
  "tr": "{name} zamanı",
  "ar": "حان وقت {name}"
 },
 "notif_dose_body_fallback": {
  "nl": "Vergeet je medicatie niet.",
  "en": "Don't forget your medication.",
  "de": "Vergiss dein Medikament nicht.",
  "fr": "N'oublie pas ton médicament.",
  "es": "No olvides tu medicación.",
  "tr": "İlacını unutma.",
  "ar": "لا تنسَ دواءك."
 },
 "notif_period_title": {
  "nl": "{period} is voorbij",
  "en": "{period} is over",
  "de": "{period} ist vorbei",
  "fr": "{period} est terminé",
  "es": "{period} ha terminado",
  "tr": "{period} sona erdi",
  "ar": "انتهت فترة {period}"
 },
 "notif_period_body": {
  "nl": "Nog niet afgevinkt: {list}",
  "en": "Not checked off yet: {list}",
  "de": "Noch nicht abgehakt: {list}",
  "fr": "Pas encore coché : {list}",
  "es": "Aún no marcado: {list}",
  "tr": "Henüz işaretlenmedi: {list}",
  "ar": "لم يُسجَّل بعد: {list}"
 },
 "notif_refill_title": {
  "nl": "Bijna op: {name}",
  "en": "Running low: {name}",
  "de": "Wird knapp: {name}",
  "fr": "Stock faible : {name}",
  "es": "Existencias bajas: {name}",
  "tr": "Azalıyor: {name}",
  "ar": "أوشك على النفاد: {name}"
 },
 "notif_refill_body": {
  "nl": "Nog ongeveer {days} {unit} voorraad — leeg op {date}. Tijd om bij te bestellen.",
  "en": "About {days} {unit} of supply left — runs out on {date}. Time to reorder.",
  "de": "Noch etwa {days} {unit} Vorrat — leer am {date}. Zeit zum Nachbestellen.",
  "fr": "Environ {days} {unit} de stock restant — épuisé le {date}. Il est temps de recommander.",
  "es": "Quedan aproximadamente {days} {unit} de existencias — se agotan el {date}. Hora de volver a pedir.",
  "tr": "Yaklaşık {days} {unit} stok kaldı — {date} tarihinde biter. Yeniden sipariş zamanı.",
  "ar": "تبقّى نحو {days} {unit} من المخزون — وينفد في {date}. حان وقت إعادة الطلب."
 },
 "confirm_import": {
  "nl": "Dit vervangt je huidige medicijnen en geschiedenis door de back-up. Doorgaan?",
  "en": "This will replace your current medications and history with the backup. Continue?",
  "de": "Dadurch werden deine aktuellen Medikamente und dein Verlauf durch das Backup ersetzt. Fortfahren?",
  "fr": "Cela remplacera tes médicaments et ton historique actuels par la sauvegarde. Continuer ?",
  "es": "Esto reemplazará tu medicación y tu historial actuales por la copia de seguridad. ¿Continuar?",
  "tr": "Bu işlem mevcut ilaçlarını ve geçmişini yedekle değiştirecek. Devam edilsin mi?",
  "ar": "سيؤدي هذا إلى استبدال أدويتك الحالية وسجلّك بالنسخة الاحتياطية. هل تريد المتابعة؟"
 },
 "alert_import_failed": {
  "nl": "Kon dit back-upbestand niet lezen. Controleer of het een geldig MedBox-exportbestand is.",
  "en": "Couldn't read this backup file. Check that it's a valid MedBox export file.",
  "de": "Diese Backup-Datei konnte nicht gelesen werden. Überprüfe, ob es sich um eine gültige MedBox-Exportdatei handelt.",
  "fr": "Impossible de lire ce fichier de sauvegarde. Vérifie qu'il s'agit d'un fichier d'export MedBox valide.",
  "es": "No se pudo leer este archivo de copia de seguridad. Comprueba que sea un archivo de exportación de MedBox válido.",
  "tr": "Bu yedek dosyası okunamadı. Geçerli bir MedBox dışa aktarma dosyası olduğundan emin ol.",
  "ar": "تعذّرت قراءة ملف النسخة الاحتياطية هذا. تأكّد من أنه ملف تصدير MedBox صالح."
 },
 "undo_toast_text": {
  "nl": "{name} gemarkeerd als ingenomen",
  "en": "{name} marked as taken",
  "de": "{name} als eingenommen markiert",
  "fr": "{name} marqué comme pris",
  "es": "{name} marcado como tomado",
  "tr": "{name} alındı olarak işaretlendi",
  "ar": "تم تمييز {name} كمأخوذ"
 },
 "undo_toast_button": {
  "nl": "Ongedaan maken",
  "en": "Undo",
  "de": "Rückgängig",
  "fr": "Annuler",
  "es": "Deshacer",
  "tr": "Geri al",
  "ar": "تراجع"
 },
 "undo_toast_dismiss": {
  "nl": "Sluiten",
  "en": "Dismiss",
  "de": "Schließen",
  "fr": "Fermer",
  "es": "Cerrar",
  "tr": "Kapat",
  "ar": "إغلاق"
 },
 "settings_install_already": {
  "nl": "MedBox is al geïnstalleerd als app op dit apparaat.",
  "en": "MedBox is already installed as an app on this device.",
  "de": "MedBox ist auf diesem Gerät bereits als App installiert.",
  "fr": "MedBox est déjà installée en tant qu'application sur cet appareil.",
  "es": "MedBox ya está instalada como aplicación en este dispositivo.",
  "tr": "MedBox bu cihazda zaten uygulama olarak yüklü.",
  "ar": "تم بالفعل تثبيت MedBox كتطبيق على هذا الجهاز."
 },
 "settings_install_explain": {
  "nl": "Zet MedBox op je startscherm als een volwaardige app — sneller opstarten, een eigen icoon, en werkt ook zonder internetverbinding.",
  "en": "Add MedBox to your home screen as a full app — faster to open, its own icon, and it keeps working without an internet connection.",
  "de": "Füge MedBox als eigenständige App zu deinem Startbildschirm hinzu — schnellerer Start, ein eigenes Symbol, und funktioniert auch ohne Internetverbindung.",
  "fr": "Ajoute MedBox à ton écran d'accueil comme une véritable application — démarrage plus rapide, icône dédiée, et fonctionne aussi sans connexion internet.",
  "es": "Añade MedBox a tu pantalla de inicio como una aplicación completa — se abre más rápido, tiene su propio icono y también funciona sin conexión a internet.",
  "tr": "MedBox'ı tam bir uygulama olarak ana ekranına ekle — daha hızlı açılır, kendi simgesine sahiptir ve internet bağlantısı olmadan da çalışır.",
  "ar": "أضف MedBox إلى شاشتك الرئيسية كتطبيق كامل — يفتح أسرع، وله أيقونة خاصة، ويعمل أيضًا بدون اتصال بالإنترنت."
 },
 "settings_install_button": {
  "nl": "Installeer MedBox",
  "en": "Install MedBox",
  "de": "MedBox installieren",
  "fr": "Installer MedBox",
  "es": "Instalar MedBox",
  "tr": "MedBox'ı yükle",
  "ar": "تثبيت MedBox"
 },
 "settings_trend_title": {
  "nl": "Therapietrouw",
  "en": "Adherence trend",
  "de": "Therapietreue",
  "fr": "Observance",
  "es": "Adherencia al tratamiento",
  "tr": "Tedaviye uyum",
  "ar": "الالتزام بالعلاج"
 },
 "settings_trend_explain": {
  "nl": "Percentage ingenomen doses per week, over de laatste 8 weken. Alleen medicatie met een vast schema telt mee.",
  "en": "Percentage of doses taken per week, over the last 8 weeks. Only medication with a fixed schedule counts.",
  "de": "Prozentsatz der eingenommenen Dosen pro Woche, über die letzten 8 Wochen. Nur Medikamente mit festem Zeitplan zählen.",
  "fr": "Pourcentage de doses prises par semaine, sur les 8 dernières semaines. Seuls les médicaments à horaire fixe sont comptabilisés.",
  "es": "Porcentaje de dosis tomadas por semana, durante las últimas 8 semanas. Solo cuenta la medicación con un horario fijo.",
  "tr": "Son 8 haftadaki haftalık alınan doz yüzdesi. Yalnızca sabit programı olan ilaçlar sayılır.",
  "ar": "نسبة الجرعات المأخوذة أسبوعيًا خلال آخر 8 أسابيع. تُحتسب فقط الأدوية ذات الجدول الثابت."
 },
 "settings_trend_empty": {
  "nl": "Nog niet genoeg gegevens om een trend te tonen.",
  "en": "Not enough data yet to show a trend.",
  "de": "Noch nicht genug Daten, um einen Trend anzuzeigen.",
  "fr": "Pas encore assez de données pour afficher une tendance.",
  "es": "Aún no hay suficientes datos para mostrar una tendencia.",
  "tr": "Bir eğilim göstermek için henüz yeterli veri yok.",
  "ar": "لا توجد بيانات كافية بعد لعرض اتجاه."
 },
 "settings_trend_avg_one": {
  "nl": "Gemiddeld {pct}% over de laatste week",
  "en": "Average {pct}% over the last week",
  "de": "Durchschnittlich {pct}% in der letzten Woche",
  "fr": "Moyenne de {pct} % sur la dernière semaine",
  "es": "Media del {pct}% en la última semana",
  "tr": "Geçen hafta ortalama %{pct}",
  "ar": "بمعدل {pct}% خلال الأسبوع الماضي"
 },
 "settings_trend_avg_other": {
  "nl": "Gemiddeld {pct}% over de laatste {n} weken",
  "en": "Average {pct}% over the last {n} weeks",
  "de": "Durchschnittlich {pct}% in den letzten {n} Wochen",
  "fr": "Moyenne de {pct} % sur les {n} dernières semaines",
  "es": "Media del {pct}% en las últimas {n} semanas",
  "tr": "Son {n} haftada ortalama %{pct}",
  "ar": "بمعدل {pct}% خلال آخر {n} أسابيع"
 }
};

// ---------- Design tokens (light + dark) ----------
const LIGHT = {
  bg: "#EEF2EE",
  surface: "#FBFCFA",
  surfaceSoft: "#F1F5F1",
  raised: "#FFFFFF",
  jarBorder: "#DCE3DD",
  ink: "#233E38",
  muted: "#446056",
  mutedSoft: "#4B655C",
  border: "#DCE3DD",
  primary: "#2F6B5E",
  primarySoft: "#DEEAE4",
  success: "#5C8A63",
  successSoft: "#E4EEE2",
  warn: "#B4502C",
  warnSoft: "#F5E1D6",
  gold: "#D8A339",
  goldSoft: "#F6ECD3",
};
const DARK = {
  bg: "#0D1C16",
  surface: "#16281F",
  surfaceSoft: "#1C3129",
  raised: "#284D40",
  jarBorder: "rgba(238,247,242,0.65)",
  ink: "#EAF3EF",
  muted: "#9FBCB1",
  mutedSoft: "#ABC9C0",
  border: "#3A5C4C",
  primary: "#5CB498",
  primarySoft: "#20392F",
  success: "#83C793",
  successSoft: "#1C3527",
  warn: "#E5926A",
  warnSoft: "#38251B",
  gold: "#E8C567",
  goldSoft: "#382C16",
};
// Hoog contrast overlay: strengthens only the tokens responsible for text
// and outlines (never the brand/status colors, which already carry their
// own deliberately-tuned contrast) so borders and body text read clearly
// without changing the app's overall look and feel.
const LIGHT_HC_OVERRIDES = { ink: "#000000", muted: "#16281F", mutedSoft: "#0E1F19", border: "#16281F", jarBorder: "#16281F" };
const DARK_HC_OVERRIDES = { ink: "#FFFFFF", muted: "#F2FAF6", mutedSoft: "#FFFFFF", border: "#F2FAF6", jarBorder: "#F2FAF6" };
function withHighContrast(theme, highContrast, isDark) {
  if (!highContrast) return theme;
  return { ...theme, ...(isDark ? DARK_HC_OVERRIDES : LIGHT_HC_OVERRIDES) };
}
const TEXT_SIZE_SCALE = { normaal: 1, groot: 1.15, "extra-groot": 1.3 };
const ThemeContext = React.createContext(LIGHT);
function useThemeColors() { return React.useContext(ThemeContext); }

// ---------- i18n ----------
const LANGUAGES = [
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];
const LOCALE_MAP = { nl: "nl-NL", en: "en-GB", de: "de-DE", fr: "fr-FR", es: "es-ES", tr: "tr-TR", ar: "ar" };
const RTL_LANGS = new Set(["ar"]);
// Monday-first, matching this app's week layout (getWeekDates / weekdays picker).
const DAY_NAMES_BY_LANG = {
  nl: ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"],
  en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  de: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
  fr: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
  es: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
  tr: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
  ar: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
};
const DAY_SHORT_BY_LANG = {
  nl: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  fr: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  tr: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
  ar: ["اثن", "ثلا", "أرب", "خمي", "جمع", "سبت", "أحد"],
};
// Dutch words used as stable internal identifiers/object keys throughout the
// app (periodBounds[p], todaysByPeriod[period], med.frequency, MEALS[].key,
// etc.) are never translated at the data level — only these small maps take
// an internal key to the matching TRANSLATIONS key for display.
const PERIOD_KEY_MAP = { Ochtend: "period_ochtend", Middag: "period_middag", Avond: "period_avond", Nacht: "period_nacht" };
const MEAL_KEY_MAP = { ontbijt: "meal_breakfast", lunch: "meal_lunch", diner: "meal_dinner" };
const LangContext = React.createContext("nl");
function useL() {
  const lang = React.useContext(LangContext);
  return function L(key, vars) {
    const entry = TRANSLATIONS[key];
    let str = entry ? (entry[lang] || entry.nl || key) : key;
    if (vars) {
      Object.keys(vars).forEach((k) => { str = str.split(`{${k}}`).join(String(vars[k])); });
    }
    return str;
  };
}
function usePlural() {
  const L = useL();
  return function P(prefix, n, vars) {
    const key = `${prefix}_${n === 1 ? "one" : "other"}`;
    return L(key, { n, ...vars });
  };
}

const MED_COLORS = ["#2F6B5E", "#B4502C", "#D8A339", "#3E6FA6", "#6E5A9C", "#C2555C", "#5C8A63"];
const EMPTY_EMERGENCY_INFO = { allergies: "", contactName: "", contactPhone: "", doctorName: "", doctorPhone: "", pharmacyName: "", pharmacyPhone: "" };
const DAY_NAMES = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const DAY_SHORT = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const REFILL_LEAD_DAYS = 30;
const PERIOD_ORDER = ["Ochtend", "Middag", "Avond", "Nacht"];
const DEFAULT_PERIOD_BOUNDS = { Nacht: "00:00", Ochtend: "06:00", Middag: "12:00", Avond: "18:00" };
const MEALS = [
  { key: "ontbijt", label: "Na het ontbijt", period: "Ochtend", order: 420 },
  { key: "lunch", label: "Na de lunch", period: "Middag", order: 750 },
  { key: "diner", label: "Na het diner", period: "Avond", order: 1140 },
];
const COMMON_MED_NAMES = [
  "Paracetamol", "Ibuprofen", "Metoprolol", "Simvastatine", "Omeprazol", "Metformine",
  "Amlodipine", "Levothyroxine", "Salbutamol", "Diclofenac", "Losartan", "Atorvastatine",
  "Pantoprazol", "Prednison", "Amoxicilline", "Furosemide", "Citalopram", "Sertraline",
  "Tramadol", "Acetylsalicylzuur", "Apixaban", "Rivaroxaban", "Colecalciferol (vitamine D)",
  "Oxazepam", "Temazepam", "Venlafaxine", "Mirtazapine", "Ramipril", "Bisoprolol",
  "Perindopril", "Hydrochloorthiazide", "Spironolacton", "Allopurinol", "Tamsulosine",
  "Finasteride", "Montelukast", "Fluticason", "Budesonide", "Doxycycline", "Azitromycine",
  "Ciprofloxacine", "Clopidogrel", "Acenocoumarol", "Methotrexaat", "Prednisolon", "Diazepam", "Naproxen",
];

function pad2(n) { return String(n).padStart(2, "0"); }
function isoDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function getWeekDates(base) {
  const start = startOfWeek(base);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
}
function timeToMinutes(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function computePeriodForTime(time, bounds) {
  const mins = timeToMinutes(time);
  const entries = PERIOD_ORDER.map((p) => ({ p, start: timeToMinutes(bounds[p] || DEFAULT_PERIOD_BOUNDS[p]) })).sort((a, b) => a.start - b.start);
  let chosen = entries[entries.length - 1];
  for (const e of entries) if (e.start <= mins) chosen = e;
  return chosen.p;
}
function periodEndDateTimes(bounds, todayISO) {
  const entries = PERIOD_ORDER.map((p) => ({ p, start: timeToMinutes(bounds[p] || DEFAULT_PERIOD_BOUNDS[p]) })).sort((a, b) => a.start - b.start);
  const [y, mo, da] = todayISO.split("-").map(Number);
  const results = {};
  entries.forEach((cur, i) => {
    const next = entries[(i + 1) % entries.length];
    const dayOffset = i === entries.length - 1 ? 1 : 0;
    results[cur.p] = new Date(y, mo - 1, da + dayOffset, Math.floor(next.start / 60), next.start % 60, 0, 0);
  });
  return results;
}
function scheduledDateTime(dateISO, time) {
  const [h, m] = time.split(":").map(Number);
  const [y, mo, da] = dateISO.split("-").map(Number);
  return new Date(y, mo - 1, da, h, m, 0, 0);
}
function uid() { return Math.random().toString(36).slice(2, 10); }

// ---------- Calendar (.ics) export ----------
// One recurring VEVENT per scheduled moment. Fixed clock times map straight
// to a DTSTART + RRULE; "after a meal" moments have no clock time, so they're
// approximated using the same dagdeel start the app already shows for that
// meal — the event text says so plainly rather than pretending precision.
const ICS_BYDAY = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
function icsDateTimeLocal(date) {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}T${pad2(date.getHours())}${pad2(date.getMinutes())}00`;
}
function icsEscape(text) {
  return String(text || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
function icsFoldLine(line) {
  // RFC 5545: lines should be folded at 75 octets, continuation starts with a space.
  if (line.length <= 75) return line;
  let out = line.slice(0, 75);
  let rest = line.slice(75);
  while (rest.length > 0) {
    out += "\r\n " + rest.slice(0, 74);
    rest = rest.slice(74);
  }
  return out;
}
function buildIcsCalendar(medications, periodBounds, todayISO, L) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MedBox//NL", "CALSCALE:GREGORIAN"];
  const stamp = todayISO.replace(/-/g, "") + "T000000";
  medications.forEach((med) => {
    if (med.frequency === "indien_nodig") return;
    (med.times || []).forEach((t) => {
      const approx = isMeal(t);
      const time = approx ? (periodBounds[mealInfo(t.meal).period] || DEFAULT_PERIOD_BOUNDS[mealInfo(t.meal).period]) : t.time;
      const start = scheduledDateTime(todayISO, time);
      const end = new Date(start.getTime() + 15 * 60000);
      const rrule = med.frequency === "weekdagen"
        ? `RRULE:FREQ=WEEKLY;BYDAY=${(med.weekdays || []).map((d) => ICS_BYDAY[d]).join(",")}`
        : "RRULE:FREQ=DAILY";
      const dose = doseLabel(med, t, L);
      const summary = approx ? `${med.name} (${L(MEAL_KEY_MAP[t.meal] || t.meal)})` : `${med.name}`;
      const descParts = [dose];
      if (approx) descParts.push(L("ics_approx_note"));
      lines.push(
        "BEGIN:VEVENT",
        `UID:${med.id}-${momentKeyPart(t)}@medbox`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${icsDateTimeLocal(start)}`,
        `DTEND:${icsDateTimeLocal(end)}`,
        rrule,
        icsFoldLine(`SUMMARY:${icsEscape(summary)}`),
        icsFoldLine(`DESCRIPTION:${icsEscape(descParts.join(" — "))}`),
        "END:VEVENT"
      );
    });
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

// ---------- Moment helpers: a moment is either a fixed clock time, or "after a meal" ----------
function mealInfo(key) { return MEALS.find((m) => m.key === key) || MEALS[0]; }
function isMeal(t) { return t.mode === "meal"; }
function momentPeriod(t, bounds) { return isMeal(t) ? mealInfo(t.meal).period : computePeriodForTime(t.time, bounds); }
function momentSortValue(t) { return isMeal(t) ? mealInfo(t.meal).order : timeToMinutes(t.time); }
function momentLabel(t, L) { return isMeal(t) ? L(MEAL_KEY_MAP[t.meal] || t.meal) : t.time; }
function statusLabel(status, L) { return status === "taken" ? L("status_taken") : status === "missed" ? L("status_missed") : L("status_upcoming"); }
function momentKeyPart(t) { return isMeal(t) ? `meal:${t.meal}` : t.time; }
function logKeyFor(medId, dateISO, t) { return `${medId}_${dateISO}_${momentKeyPart(t)}`; }
function momentStatus(t, dateISO, log, now, todayISO, periodEnds) {
  const key = t._logKey;
  if (log[key]?.taken) return "taken";
  if (isMeal(t)) {
    if (dateISO < todayISO) return "missed";
    if (dateISO > todayISO) return "upcoming";
    // Today: use the same dagdeel-end time the notifications already fire on,
    // instead of waiting for the calendar date to roll over — a missed "na
    // het ontbijt" dose should read as missed once Ochtend ends, not at midnight.
    const end = periodEnds && periodEnds[mealInfo(t.meal).period];
    return end && now > end ? "missed" : "upcoming";
  }
  return scheduledDateTime(dateISO, t.time) > now ? "upcoming" : "missed";
}
function nextDoseTiming(t, now, todayISO, L) {
  if (isMeal(t)) return momentLabel(t, L);
  const dt = scheduledDateTime(todayISO, t.time);
  const diffMin = Math.round((dt - now) / 60000);
  if (diffMin <= 0) return L("home_next_now", { time: t.time });
  if (diffMin < 60) return L("home_next_soon", { min: diffMin, time: t.time });
  return L("home_next_at", { time: t.time });
}
function unitWordFor(med, count = 2, L) {
  if (med.unitType === "overig") return med.customUnitLabel || (L ? L("unit_other_default") : "stuks");
  if (med.unitType === "zalf") return L ? L(count === 1 ? "unit_ointment_singular" : "unit_ointment_plural") : (count === 1 ? "toepassing" : "toepassingen");
  if (med.unitType === "druppels") return L ? L(count === 1 ? "unit_drop_singular" : "unit_drop_plural") : (count === 1 ? "druppel" : "druppels");
  return L ? L(count === 1 ? "unit_tablet_singular" : "unit_tablet_plural") : (count === 1 ? "tablet" : "tabletten");
}
function doseLabel(med, t, L) {
  const count = t?.count && t.count > 0 ? t.count : 1;
  let base = med.dosePerUnit ? `${count} × ${med.dosePerUnit}` : `${count} ${unitWordFor(med, count, L)}`;
  if (t?.note) base = `${base} · ${t.note}`;
  return base;
}
function isDayScheduled(med, date) {
  if (med.frequency === "indien_nodig") return false;
  // A medication never counts as "due" on a day before it was added — otherwise
  // adding a new med retroactively creates missed doses (and breaks the streak)
  // for days it didn't exist yet.
  if (med.createdAt) {
    const created = new Date(med.createdAt);
    const day0 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const created0 = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    if (day0 < created0) return false;
  }
  if (med.frequency === "weekdagen") return (med.weekdays || []).includes((date.getDay() + 6) % 7);
  return true;
}
function dosesPerDayFor(med) {
  return med.totalPerDay || (med.times || []).reduce((s, t) => s + (t.count || 1), 0) || 1;
}
function normalizeMed(med) {
  const times = (med.times || []).map((t) => {
    if (typeof t === "string") return { id: uid(), mode: "time", time: t, count: 1, note: "" };
    if (t.mode === "meal") return { id: t.id || uid(), mode: "meal", meal: t.meal, count: typeof t.count === "number" && t.count > 0 ? t.count : 1, note: t.note || "" };
    return { id: t.id || uid(), mode: "time", time: t.time, count: typeof t.count === "number" && t.count > 0 ? t.count : 1, note: t.note || t.doseNote || "" };
  });
  const frequency = med.frequency === "weekdagen" ? "weekdagen" : med.frequency === "indien_nodig" ? "indien_nodig" : "dagelijks";
  const fallbackTotal = times.reduce((s, t) => s + (t.count || 1), 0) || 1;
  return {
    ...med, times, frequency,
    weekdays: Array.isArray(med.weekdays) ? med.weekdays : [],
    prnDoseCount: typeof med.prnDoseCount === "number" && med.prnDoseCount > 0 ? med.prnDoseCount : 1,
    totalPerDay: frequency === "indien_nodig" ? null : (typeof med.totalPerDay === "number" && med.totalPerDay > 0 ? med.totalPerDay : fallbackTotal),
    dosePerUnit: med.dosePerUnit || "",
    // "zalf" en "druppels" zijn, net als "tabletten", vaste voorkeuzes met een
    // eigen vertaald eenheidswoord (zie unitWordFor) — alleen "overig" heeft
    // nog een vrij invulbaar customUnitLabel. Alles wat geen van deze drie is
    // (of ontbreekt, bij oudere opgeslagen data) valt terug op "tabletten".
    unitType: ["overig", "zalf", "druppels"].includes(med.unitType) ? med.unitType : "tabletten",
    customUnitLabel: med.customUnitLabel || "",
  };
}
function fileToCompressedDataURL(file, maxSize = 160, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lezen mislukt"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Afbeelding laden mislukt"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---------- Claude API helpers (photo name recognition & general leaflet info) ----------
async function callClaude(content) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 500, messages: [{ role: "user", content }] }),
  });
  const data = await resp.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  return text.replace(/```json|```/g, "").trim();
}
async function recognizeNameFromPhoto(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const raw = await callClaude([
    { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
    { type: "text", text: 'Dit is een foto van een medicijnverpakking of pillendoosje. Lees de naam van het medicijn en, indien zichtbaar, de sterkte/dosering op de verpakking. Antwoord ALLEEN met geldige JSON, geen andere tekst: {"naam":"...","dosering":"..."}. Als je de naam niet met voldoende zekerheid kunt lezen, zet "naam" op een lege string.' },
  ]);
  return JSON.parse(raw);
}
async function fetchLeafletInfo(name) {
  const raw = await callClaude([
    { type: "text", text: `Geef algemene, feitelijke informatie in het Nederlands over het medicijn "${name}", puur ter oriëntatie — geen vervanging voor de officiële bijsluiter of medisch advies. Antwoord ALLEEN met geldige JSON, geen andere tekst, in dit formaat: {"gebruik":"...","dosering":"...","bijwerkingen":"...","waarschuwing":"..."}. Houd elk veld tot maximaal 2 korte zinnen. Als je dit medicijn niet met voldoende zekerheid herkent, zet elk veld op "Onbekend — raadpleeg de officiële bijsluiter of je apotheker."` },
  ]);
  return JSON.parse(raw);
}

// ---------- Pillbox compartment (signature visual) ----------
// Redesigned from scratch around three unambiguous states instead of a lid
// that tilts to different angles: "upcoming" keeps the lid closed with the
// pill visible at an angle inside; "taken" removes the lid entirely (it
// lifts off and fades away in one smooth animation) and shows a checkmark
// badge; "missed" keeps the lid closed too, just re-colored, with an
// exclamation badge in the same style as the checkmark. Nothing rotates to
// an ambiguous in-between angle, so nothing can be mistaken for a pill.
function CompartmentBadge({ kind, T, cx, cy }) {
  const fill = kind === "check" ? T.success : T.warn;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r="9" fill={fill} stroke={T.surface} strokeWidth="2.2" />
      {kind === "check" ? (
        <path d="M-6,0.2 L-3.2,3.2 L2.5,-3.8" stroke="#fff" strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <rect x="-1.1" y="-4.6" width="2.2" height="5.4" rx="1.1" fill="#fff" />
          <circle cy="3.6" r="1.25" fill="#fff" />
        </>
      )}
    </g>
  );
}
// Open-top outline: traces the left wall, rounded bottom corners and bottom
// edge, and the right wall — but deliberately never closes back across the
// top. Used only for "taken", so the border itself reads as an open mouth
// instead of a sealed container once the lid is gone.
function openBodyPath(x, y, w, h, rx) {
  return `M ${x},${y} L ${x},${y + h - rx} Q ${x},${y + h} ${x + rx},${y + h} L ${x + w - rx},${y + h} Q ${x + w},${y + h} ${x + w},${y + h - rx} L ${x + w},${y}`;
}
function Compartment({ status, color, size = 44, onClick, label, pop }) {
  const T = useThemeColors();
  const isTaken = status === "taken";
  const isMissed = status === "missed";
  const bodyFill = isTaken ? T.successSoft : isMissed ? T.warnSoft : T.surface;
  // A clearly-visible neutral outline (instead of the near-invisible pale
  // gray "border" token) for the closed states; taken/missed keep their own
  // status color.
  const bodyStroke = isTaken ? T.success : isMissed ? T.warn : T.mutedSoft;
  const lidFill = isMissed ? T.warn : T.raised;
  const lidStroke = isMissed ? T.warn : T.mutedSoft;
  const grooveColor = "rgba(0,0,0,0.12)";
  const lidTransform = isTaken ? "translate(9px,-15px) rotate(38deg) scale(0.55)" : "translate(0,0) rotate(0deg) scale(1)";
  // Smaller lid (24 wide / 9 tall) than the full jar mouth, so it reads as a
  // compact cap rather than dominating the icon.
  const lidX = 10, lidY = 10, lidW = 24, lidH = 9, lidRx = 4.5;
  return (
    <button onClick={onClick} aria-label={label} title={label} className={pop ? "wd-pop" : undefined} style={{ background: "none", border: "none", padding: 0, cursor: onClick ? "pointer" : "default", display: "inline-flex", width: size, height: size * 1.16 }}>
      <svg viewBox="0 0 44 52" width={size} height={size * 1.16} style={{ overflow: "visible" }}>
        {isTaken ? (
          <>
            <rect x="6" y="18" width="32" height="30" rx="11" fill={bodyFill} />
            <path d={openBodyPath(6, 18, 32, 30, 11)} fill="none" stroke={bodyStroke} strokeWidth="2" strokeLinecap="round" />
            {/* Rim at the mouth, spanning the full body width so its ends meet the open path's wall tops exactly — reads as one continuous open rim instead of a separate floating ring. */}
            <ellipse cx="22" cy="18" rx="16" ry="3.2" fill="none" stroke={bodyStroke} strokeWidth="1.6" opacity="0.6" />
          </>
        ) : (
          <rect x="6" y="18" width="32" height="30" rx="11" fill={bodyFill} stroke={bodyStroke} strokeWidth="2" />
        )}
        <rect x="9" y="21" width="8" height="24" rx="4" fill="#ffffff" opacity="0.07" />
        {!isTaken && (
          <g style={{ transformBox: "view-box", transformOrigin: "22px 34px", transform: "rotate(28deg)" }}>
            <rect x="14.5" y="28.5" width="15" height="8.4" rx="4.2" fill={isMissed ? "#E7C3B2" : color} opacity={isMissed ? 0.55 : 1} />
            <rect x="14.5" y="28.5" width="7" height="8.4" rx="4.2" fill="#ffffff" opacity="0.35" />
          </g>
        )}
        <g style={{ transformBox: "view-box", transformOrigin: "22px 19px", transform: lidTransform, transition: "transform 0.45s cubic-bezier(.3,1.4,.4,1), opacity 0.4s ease", opacity: isTaken ? 0 : 1 }}>
          <rect x={lidX} y={lidY} width={lidW} height={lidH} rx={lidRx} fill={lidFill} stroke={lidStroke} strokeWidth="1.6" />
          <rect x={lidX + 3} y={lidY + 1.6} width={lidW - 6} height="2.4" rx="1.2" fill="#ffffff" opacity="0.18" />
          <line x1={lidX + 6} y1={lidY + 2.5} x2={lidX + 6} y2={lidY + lidH - 2.5} stroke={grooveColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1={lidX + 12} y1={lidY + 2.5} x2={lidX + 12} y2={lidY + lidH - 2.5} stroke={grooveColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1={lidX + 18} y1={lidY + 2.5} x2={lidX + 18} y2={lidY + lidH - 2.5} stroke={grooveColor} strokeWidth="1.2" strokeLinecap="round" />
        </g>
        {isTaken && <CompartmentBadge kind="check" T={T} cx={33} cy={14} />}
        {isMissed && <CompartmentBadge kind="warn" T={T} cx={33} cy={14} />}
      </svg>
    </button>
  );
}

// ---------- Day-progress jar: drains as doses are checked off, in the same visual language as the compartments ----------
function ProgressJar({ color, taken, total, size = 58 }) {
  const T = useThemeColors();
  const remaining = Math.max(0, total - taken);
  const frac = total > 0 ? Math.min(1, remaining / total) : 0;
  const complete = remaining <= 0 && total > 0;
  // Same body + lid geometry as Compartment's "upcoming" jar (viewBox, body
  // rect, lid position/size) so the two icon families form one visual whole.
  const bodyTop = 18, bodyBottom = 48, bodyHeight = bodyBottom - bodyTop;
  const fillHeight = bodyHeight * frac;
  const fillY = bodyBottom - fillHeight;
  const clipId = useId();
  const lidX = 10, lidY = 10, lidW = 24, lidH = 9, lidRx = 4.5;
  return (
    <svg viewBox="0 0 44 52" width={size} height={size * (52 / 44)} style={{ overflow: "visible" }}>
      <rect x="6" y="18" width="32" height="30" rx="11" fill={T.surface} stroke={T.mutedSoft} strokeWidth="2" />
      <rect x="9" y="21" width="8" height="24" rx="4" fill="#ffffff" opacity="0.07" />
      <rect x={lidX} y={lidY} width={lidW} height={lidH} rx={lidRx} fill={T.raised} stroke={T.mutedSoft} strokeWidth="1.6" />
      <rect x={lidX + 3} y={lidY + 1.6} width={lidW - 6} height="2.4" rx="1.2" fill="#ffffff" opacity="0.18" />
      <line x1={lidX + 6} y1={lidY + 2.5} x2={lidX + 6} y2={lidY + lidH - 2.5} stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1={lidX + 12} y1={lidY + 2.5} x2={lidX + 12} y2={lidY + lidH - 2.5} stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1={lidX + 18} y1={lidY + 2.5} x2={lidX + 18} y2={lidY + lidH - 2.5} stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" strokeLinecap="round" />
      <clipPath id={clipId}><rect x="7" y="19" width="30" height="28" rx="10" /></clipPath>
      <g clipPath={`url(#${clipId})`}>
        {fillHeight > 0 && <rect x="7" y={fillY} width="30" height={fillHeight + 4} fill={complete ? T.success : color} opacity="0.85" />}
      </g>
      {complete && (
        <g transform="translate(22,33)">
          <path d="M-6,0 L-2,5 L7,-6" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

// ---------- Auto-generated avatar (used instead of a manually-added photo by default) ----------
function AvatarBadge({ name, color, photo, size = 32 }) {
  const T = useThemeColors();
  if (photo) return <img src={photo} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${T.border}` }} />;
  const initials = (name || "?").trim().slice(0, 2).toUpperCase();
  return (
    <div className="wd-display" style={{ width: size, height: size, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: `calc(${size * 0.4}px * var(--wd-text-scale, 1))`, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ---------- Bottom mobile navigation ----------
function BottomNav({ active, onNavigate }) {
  const T = useThemeColors();
  const L = useL();
  const items = [
    { key: "vandaag", label: L("nav_today"), icon: <Home size={21} /> },
    { key: "week", label: L("nav_week"), icon: <Calendar size={21} /> },
    { key: "beheer", label: L("nav_manage"), icon: <ClipboardList size={21} /> },
    { key: "instellingen", label: L("nav_settings"), icon: <Settings2 size={21} /> },
  ];
  return (
    <div className="no-print" style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: T.surface, borderTop: `1.5px solid ${T.border}`, display: "flex", justifyContent: "space-around", paddingTop: 6, paddingBottom: "max(6px, env(safe-area-inset-bottom))", zIndex: 40, boxShadow: "0 -3px 14px rgba(27,58,52,0.08)" }}>
      {items.map((it) => (
        <button key={it.key} onClick={() => onNavigate(it.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "none", border: "none", color: active === it.key ? T.primary : T.mutedSoft, cursor: "pointer", minWidth: 68, minHeight: 52, padding: "4px 6px" }}>
          {it.icon}
          <span style={{ fontSize: "calc(10.5px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [storageIssue, setStorageIssue] = useState(false);
  // Multiple people can share one MedBox install (a family, or several
  // household members). `medications`/`log`/`emergencyInfo` always hold the
  // ACTIVE profile's data — every existing piece of app logic keeps reading
  // and writing those three exactly as before. The other profiles' data
  // lives in profilesDataRef (see switchProfile / the save effect below),
  // only touched when switching profiles or persisting to storage, so nothing
  // else in the app needs to know profiles exist at all.
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [showProfiles, setShowProfiles] = useState(false);
  const profilesDataRef = useRef({});
  const [medications, setMedications] = useState([]);
  const [log, setLog] = useState({});
  const [periodBounds, setPeriodBounds] = useState(DEFAULT_PERIOD_BOUNDS);
  const [darkMode, setDarkMode] = useState(false);
  const [textSize, setTextSize] = useState("normaal");
  const [highContrast, setHighContrast] = useState(false);
  const [icsExportEnabled, setIcsExportEnabled] = useState(false);
  const [language, setLanguage] = useState("nl");
  const [homeTipDismissed, setHomeTipDismissed] = useState(false);
  const [customMedNames, setCustomMedNames] = useState([]);
  const [celebrated, setCelebrated] = useState(false);
  const [milestoneHit, setMilestoneHit] = useState(null);
  const [poppedKey, setPoppedKey] = useState(null);
  const [expandedPeriods, setExpandedPeriods] = useState({});
  const [snoozedUntil, setSnoozedUntil] = useState({});
  const [emergencyInfo, setEmergencyInfo] = useState({ allergies: "", contactName: "", contactPhone: "", doctorName: "", doctorPhone: "", pharmacyName: "", pharmacyPhone: "" });
  const [showEmergencyCard, setShowEmergencyCard] = useState(false);
  const [lastBackupAt, setLastBackupAt] = useState(null);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [beheerSearch, setBeheerSearch] = useState("");
  // "Installeerbaar maken als app": Chrome/Edge/Android fire this event when
  // the app qualifies for installation (manifest + service worker present);
  // we stash it so a button can trigger the native prompt on tap instead of
  // relying on the browser's own, easy-to-miss install icon. iOS Safari
  // never fires this event — that platform only supports the manual "Zet op
  // beginscherm" steps already shown further down, which stay in place.
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  // Brief "ongedaan maken" affordance right after a dose is checked off, so
  // an accidental tap can be corrected without hunting for the same
  // compartment again (which may have already collapsed out of view once
  // its whole dagdeel is done).
  const [undoToast, setUndoToast] = useState(null);
  const T = withHighContrast(darkMode ? DARK : LIGHT, highContrast, darkMode);
  const textScale = TEXT_SIZE_SCALE[textSize] || 1;
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null;
  // App() renders LangContext.Provider for its own children — it isn't a
  // descendant of that provider itself, so useL()/useContext(LangContext)
  // wouldn't see `language` here. Build L directly off the state instead.
  const L = useCallback((key, vars) => {
    const entry = TRANSLATIONS[key];
    let str = entry ? (entry[language] || entry.nl || key) : key;
    if (vars) Object.keys(vars).forEach((k) => { str = str.split(`{${k}}`).join(String(vars[k])); });
    return str;
  }, [language]);
  const [now, setNow] = useState(new Date());
  const [notifPerm, setNotifPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  // The browser's own notification permission can only move forward
  // (default -> granted/denied) via Notification.requestPermission(); once
  // granted, JavaScript can never revoke it again, and once denied, the
  // browser silently refuses to re-prompt. So an in-app on/off toggle can't
  // just re-call requestPermission() for the "off" direction — it needs its
  // own flag the app respects when deciding whether to actually fire a
  // Notification, independent of what the browser permission itself says.
  const [notifDisabledByUser, setNotifDisabledByUser] = useState(false);
  const notifActive = notifPerm === "granted" && !notifDisabledByUser;
  const [showAdd, setShowAdd] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [restockMed, setRestockMed] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [activeNav, setActiveNav] = useState("vandaag");
  const [expandedLeaflet, setExpandedLeaflet] = useState(null);
  const [leafletLoadingIds, setLeafletLoadingIds] = useState(new Set());
  const firedRef = useRef(new Set());
  const periodEndFiredRef = useRef(new Set());
  const refillFiredRef = useRef(new Set());
  const loadedRef = useRef(false);
  const undoTimerRef = useRef(null);

  // Each bottom-nav item is now a distinct page rather than a scroll anchor
  // on one long page — jump to the top whenever the page changes.
  useEffect(() => { window.scrollTo(0, 0); }, [activeNav]);

  // The page's own <html>/<body> background is set once in the static HTML
  // shell (needed for the very first paint, before React/dark mode even
  // loads) and can't react to the in-app dark-mode toggle on its own. Keep
  // it in sync here too — otherwise short pages (like the empty state) or
  // iOS's elastic overscroll bounce briefly expose that original light
  // background as a pale flash/patch around the dark app content.
  useEffect(() => {
    try {
      document.documentElement.style.background = T.bg;
      document.body.style.background = T.bg;
    } catch (e) {}
  }, [T.bg]);


  // Installable-app detection: whether we're already running standalone
  // (installed), and whether the browser is offering a native install
  // prompt right now (only Chromium-based browsers fire this).
  useEffect(() => {
    try {
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);
    } catch (e) {}
    const onBeforeInstall = (e) => { e.preventDefault(); setInstallPromptEvent(e); };
    const onInstalled = () => { setInstallPromptEvent(null); setIsStandalone(true); };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    try { await installPromptEvent.userChoice; } catch (e) {}
    setInstallPromptEvent(null);
  };

  useEffect(() => {
    (async () => {
      let data = null;
      let readFailed = false;
      try {
        const res = await window.storage.get("medbox_v1", false);
        if (res?.value) data = JSON.parse(res.value);
      } catch (e) { readFailed = true; }
      if (!data && !readFailed) {
        try {
          const old = await window.storage.get("pillbox_v1", false);
          if (old?.value) data = JSON.parse(old.value);
        } catch (e) { readFailed = true; }
      }
      if (data) {
        // Profiles were introduced after this app already shipped, so a
        // saved file can be in either shape. New shape carries its own
        // `profiles` array (each profile's medications/log/emergencyInfo
        // tucked away in `profilesData`); anything saved before that has
        // `medications`/`log`/`emergencyInfo` sitting flat at the top level
        // instead — that's migrated into a single starter profile so
        // nobody's existing data disappears the first time this update runs.
        if (Array.isArray(data.profiles) && data.profiles.length > 0) {
          const pd = data.profilesData && typeof data.profilesData === "object" ? data.profilesData : {};
          const activeId = data.profiles.some((p) => p.id === data.activeProfileId) ? data.activeProfileId : data.profiles[0].id;
          profilesDataRef.current = pd;
          setProfiles(data.profiles);
          setActiveProfileId(activeId);
          const active = pd[activeId] || {};
          setMedications((active.medications || []).map(normalizeMed));
          setLog(active.log || {});
          setEmergencyInfo({ allergies: "", contactName: "", contactPhone: "", doctorName: "", doctorPhone: "", pharmacyName: "", pharmacyPhone: "", ...(active.emergencyInfo || {}) });
        } else {
          const migratedId = uid();
          setProfiles([{ id: migratedId, name: L("profile_default_name"), color: MED_COLORS[0] }]);
          setActiveProfileId(migratedId);
          setMedications((data.medications || []).map(normalizeMed));
          setLog(data.log || {});
          setEmergencyInfo({ allergies: "", contactName: "", contactPhone: "", doctorName: "", doctorPhone: "", pharmacyName: "", pharmacyPhone: "", ...(data.emergencyInfo || {}) });
        }
        setPeriodBounds(data.periodBounds || DEFAULT_PERIOD_BOUNDS);
        setDarkMode(!!data.darkMode);
        setTextSize(TEXT_SIZE_SCALE[data.textSize] ? data.textSize : "normaal");
        setHighContrast(!!data.highContrast);
        setIcsExportEnabled(!!data.icsExportEnabled);
        setLanguage(data.language || "nl");
        setHomeTipDismissed(!!data.homeTipDismissed);
        setCustomMedNames(Array.isArray(data.customMedNames) ? data.customMedNames : []);
        setLastBackupAt(data.lastBackupAt || null);
        setOnboardingSeen(!!data.onboardingSeen);
        setNotifDisabledByUser(!!data.notifDisabledByUser);
      } else if (!readFailed) {
        // Brand new install — nothing to migrate, just start with one
        // default profile so the rest of the app always has an active one.
        const freshId = uid();
        setProfiles([{ id: freshId, name: L("profile_default_name"), color: MED_COLORS[0] }]);
        setActiveProfileId(freshId);
      }
      if (readFailed) {
        // We couldn't confirm whether saved data exists or not. Treating this
        // like "no data" would let the very next autosave silently overwrite
        // a real backup, so instead we block autosave entirely and tell the
        // person, rather than guessing.
        setStorageIssue(true);
      } else {
        loadedRef.current = true;
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loadedRef.current || storageIssue || !activeProfileId) return;
    // Keep the active profile's slice of profilesDataRef current before every
    // save — medications/log/emergencyInfo only live as top-level state for
    // whichever profile is active right now, so this is where that gets
    // folded back in alongside the other (currently inactive) profiles.
    profilesDataRef.current = { ...profilesDataRef.current, [activeProfileId]: { medications, log, emergencyInfo } };
    (async () => {
      try {
        await window.storage.set("medbox_v1", JSON.stringify({ profiles, activeProfileId, profilesData: profilesDataRef.current, periodBounds, darkMode, textSize, highContrast, icsExportEnabled, language, homeTipDismissed, customMedNames, lastBackupAt, onboardingSeen, notifDisabledByUser }), false);
      } catch (e) { console.error("Opslaan mislukt", e); }
    })();
  }, [medications, log, periodBounds, darkMode, textSize, highContrast, icsExportEnabled, language, homeTipDismissed, customMedNames, emergencyInfo, lastBackupAt, onboardingSeen, notifDisabledByUser, storageIssue, profiles, activeProfileId]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Dose-time notifications — only possible for fixed-time moments; "na het ontbijt" etc. has no clock trigger.
  useEffect(() => {
    if (!notifActive) return;
    const todayISO = isoDate(now);
    medications.forEach((med) => {
      if (!isDayScheduled(med, now)) return;
      med.times.forEach((t) => {
        if (isMeal(t)) return;
        const key = logKeyFor(med.id, todayISO, t);
        const dt = scheduledDateTime(todayISO, t.time);
        const diffMin = (now - dt) / 60000;
        const taken = log[key]?.taken;
        if (!taken && diffMin >= 0 && diffMin < 1 && !firedRef.current.has(key)) {
          firedRef.current.add(key);
          try { new Notification(L("notif_dose_title", { name: med.name }), { body: doseLabel(med, t, L) || L("notif_dose_body_fallback"), tag: key }); } catch (e) {}
        }
      });
    });
  }, [now, medications, log, notifActive, L]);

  // Period-end catch-up notification — fires once when a dagdeel ends, listing anything in it
  // that's still unchecked (this covers "na maaltijd" moments, which have no clock time of their
  // own; it also quietly catches a missed fixed-time dose from that period).
  useEffect(() => {
    if (!notifActive) return;
    const todayISO = isoDate(now);
    const ends = periodEndDateTimes(periodBounds, todayISO);
    Object.entries(ends).forEach(([period, endDt]) => {
      const diffMin = (now - endDt) / 60000;
      if (diffMin < 0 || diffMin >= 1) return;
      const fireKey = `periodend_${period}_${todayISO}`;
      if (periodEndFiredRef.current.has(fireKey)) return;
      periodEndFiredRef.current.add(fireKey);
      const pending = [];
      medications.forEach((med) => { if (isDayScheduled(med, now)) med.times.forEach((t) => {
        if (momentPeriod(t, periodBounds) !== period) return;
        if (!log[logKeyFor(med.id, todayISO, t)]?.taken) pending.push(`${med.name}${isMeal(t) ? ` (${momentLabel(t, L)})` : ""}`);
      }); });
      if (pending.length > 0) {
        try { new Notification(L("notif_period_title", { period: L(PERIOD_KEY_MAP[period] || period) }), { body: L("notif_period_body", { list: pending.join(", ") }), tag: fireKey }); } catch (e) {}
      }
    });
  }, [now, medications, log, notifActive, periodBounds, L]);

  const requestNotif = async () => {
    if (typeof Notification === "undefined") return;
    if (notifPerm === "granted") {
      // The browser permission is already granted and can't be revoked from
      // JavaScript, so "turning off" here just means the app itself stops
      // firing notifications — tapping again turns it back on.
      setNotifDisabledByUser((v) => !v);
      return;
    }
    if (notifPerm === "denied") {
      // The browser will silently re-resolve to "denied" without even
      // showing a prompt — nothing we do here can change that, only the
      // browser's own site settings can. The UI explains this instead.
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
    if (perm === "granted") setNotifDisabledByUser(false);
  };

  const todayISO = isoDate(now);
  const periodEnds = useMemo(() => periodEndDateTimes(periodBounds, todayISO), [periodBounds, todayISO]);
  const currentPeriod = useMemo(() => computePeriodForTime(`${now.getHours()}:${now.getMinutes()}`, periodBounds), [now, periodBounds]);

  const getStatus = useCallback((med, t, dateISO) => {
    const key = logKeyFor(med.id, dateISO, t);
    return momentStatus({ ...t, _logKey: key }, dateISO, log, now, todayISO, periodEnds);
  }, [log, now, todayISO, periodEnds]);

  const hideUndoToast = useCallback(() => {
    if (undoTimerRef.current) { clearTimeout(undoTimerRef.current); undoTimerRef.current = null; }
    setUndoToast(null);
  }, []);

  const showUndoToast = useCallback((med, dateISO, t, key) => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoToast({ key, med, dateISO, t });
    undoTimerRef.current = setTimeout(() => { setUndoToast(null); undoTimerRef.current = null; }, 6000);
  }, []);

  const toggleTaken = (med, dateISO, t) => {
    const key = logKeyFor(med.id, dateISO, t);
    const wasTaken = !!log[key]?.taken;
    // Use the amount actually recorded when this dose was logged, not the
    // medication's current count — otherwise editing a dose's count later
    // throws off the stock number when an old entry is un-checked.
    const amount = wasTaken ? (log[key]?.amount ?? (t.count || 1)) : (t.count || 1);
    if (!wasTaken) {
      setPoppedKey(key);
      setTimeout(() => setPoppedKey((k) => (k === key ? null : k)), 420);
    }
    setLog((prev) => {
      const next = { ...prev };
      if (wasTaken) delete next[key];
      else next[key] = { taken: true, takenAt: new Date().toISOString(), amount };
      return next;
    });
    setMedications((prev) => prev.map((m) => {
      if (m.id !== med.id) return m;
      const stock = typeof m.stock === "number" ? m.stock : null;
      if (stock === null) return m;
      return { ...m, stock: wasTaken ? stock + amount : Math.max(0, stock - amount) };
    }));
    // Only offer the brief "ongedaan maken" toast when a dose was just
    // checked off — not when un-checking it again (that IS the undo), and
    // dismiss it immediately if this toggle is what un-checked the dose the
    // toast was already offering to undo.
    if (!wasTaken) showUndoToast(med, dateISO, t, key);
    else setUndoToast((cur) => (cur?.key === key ? null : cur));
  };

  const logPRN = (med) => {
    const dISO = isoDate(now);
    const key = `${med.id}_${dISO}_prn:${uid()}`;
    const amount = med.prnDoseCount || 1;
    setLog((prev) => ({ ...prev, [key]: { taken: true, takenAt: new Date().toISOString(), amount } }));
    setMedications((prev) => prev.map((m) => {
      if (m.id !== med.id) return m;
      const stock = typeof m.stock === "number" ? m.stock : null;
      if (stock === null) return m;
      return { ...m, stock: Math.max(0, stock - amount) };
    }));
    setPoppedKey(key);
    setTimeout(() => setPoppedKey((k) => (k === key ? null : k)), 420);
  };

  const undoLastPRN = (med) => {
    const dISO = isoDate(now);
    const prefix = `${med.id}_${dISO}_prn:`;
    const keys = Object.keys(log).filter((k) => k.startsWith(prefix));
    if (keys.length === 0) return;
    let latestKey = keys[0];
    keys.forEach((k) => { if ((log[k]?.takenAt || "") > (log[latestKey]?.takenAt || "")) latestKey = k; });
    // Reverse the amount that was actually deducted for this entry, not
    // whatever the medication's PRN dose count happens to be now.
    const amount = log[latestKey]?.amount ?? (med.prnDoseCount || 1);
    setLog((prev) => { const next = { ...prev }; delete next[latestKey]; return next; });
    setMedications((prev) => prev.map((m) => {
      if (m.id !== med.id) return m;
      const stock = typeof m.stock === "number" ? m.stock : null;
      if (stock === null) return m;
      return { ...m, stock: stock + amount };
    }));
  };

  // Adds to whatever stock is already tracked, instead of overwriting it —
  // so "nog 200 over, er komt 300 bij" becomes 500 without touching the
  // separate countdown that happens when doses are taken/undone above.
  const applyRestock = (med, addAmount) => {
    setMedications((prev) => prev.map((m) => (m.id === med.id ? { ...m, stock: (typeof m.stock === "number" ? m.stock : 0) + addAmount } : m)));
    setRestockMed(null);
  };

  // A gemiste dosis kan tijdelijk uit het gezicht: 15 minuten later duikt hij
  // vanzelf weer op in de "gemist"-banner, en komt er — als meldingen aan
  // staan — nog een herinnering achteraan, precies zoals de vaste innametijden.
  const snoozeDose = (med, t) => {
    const key = logKeyFor(med.id, todayISO, t);
    const minutes = 15;
    setSnoozedUntil((prev) => ({ ...prev, [key]: Date.now() + minutes * 60000 }));
    if (notifActive) {
      setTimeout(() => {
        try { new Notification(L("notif_dose_title", { name: med.name }), { body: doseLabel(med, t, L) || L("notif_dose_body_fallback"), tag: key }); } catch (e) {}
      }, minutes * 60000);
    }
  };

  // ---- Profiles: several people (a family, a household) sharing one MedBox
  // install, each with their own medications/log/emergencyInfo. Only the
  // active profile's data ever lives in the medications/log/emergencyInfo
  // state above — switching profiles snapshots the outgoing one into
  // profilesDataRef and hydrates state from the incoming one's snapshot.
  const switchProfile = (newId) => {
    if (newId === activeProfileId) { setShowProfiles(false); return; }
    profilesDataRef.current = { ...profilesDataRef.current, [activeProfileId]: { medications, log, emergencyInfo } };
    const next = profilesDataRef.current[newId] || {};
    setMedications((next.medications || []).map(normalizeMed));
    setLog(next.log || {});
    setEmergencyInfo({ ...EMPTY_EMERGENCY_INFO, ...(next.emergencyInfo || {}) });
    setActiveProfileId(newId);
    // Close anything mid-edit so it can never end up pointed at the profile
    // that was just left.
    setShowAdd(false);
    setEditingMed(null);
    setRestockMed(null);
    setShowReport(false);
    setShowEmergencyCard(false);
    setShowProfiles(false);
  };

  const addProfile = (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    const usedColors = new Set(profiles.map((p) => p.color));
    const color = MED_COLORS.find((c) => !usedColors.has(c)) || MED_COLORS[profiles.length % MED_COLORS.length];
    const newId = uid();
    profilesDataRef.current = { ...profilesDataRef.current, [activeProfileId]: { medications, log, emergencyInfo }, [newId]: { medications: [], log: {}, emergencyInfo: EMPTY_EMERGENCY_INFO } };
    setProfiles((prev) => [...prev, { id: newId, name: trimmed, color }]);
    setMedications([]);
    setLog({});
    setEmergencyInfo(EMPTY_EMERGENCY_INFO);
    setActiveProfileId(newId);
    setShowAdd(false);
    setEditingMed(null);
    setRestockMed(null);
  };

  const renameProfile = (id, name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
  };

  const deleteProfile = (id) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== id);
    const nextData = { ...profilesDataRef.current };
    delete nextData[id];
    profilesDataRef.current = nextData;
    setProfiles(remaining);
    if (id === activeProfileId) {
      const fallback = remaining[0];
      const fdata = nextData[fallback.id] || {};
      setMedications((fdata.medications || []).map(normalizeMed));
      setLog(fdata.log || {});
      setEmergencyInfo({ ...EMPTY_EMERGENCY_INFO, ...(fdata.emergencyInfo || {}) });
      setActiveProfileId(fallback.id);
    }
  };

  const handleExport = () => {
    const payload = { exportedAt: new Date().toISOString(), medications, log, periodBounds };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medbox-backup-${isoDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setLastBackupAt(new Date().toISOString());
  };

  const handleIcsExport = () => {
    const todayISO = isoDate(new Date());
    const ics = buildIcsCalendar(medications, periodBounds, todayISO, L);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medbox-agenda-${todayISO}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.medications) throw new Error("Invalid file");
      if (typeof window.confirm === "function" && !window.confirm(L("confirm_import"))) { e.target.value = ""; return; }
      setMedications((parsed.medications || []).map(normalizeMed));
      setLog(parsed.log || {});
      if (parsed.periodBounds) setPeriodBounds(parsed.periodBounds);
    } catch (err) {
      if (typeof window.alert === "function") window.alert(L("alert_import_failed"));
    }
    e.target.value = "";
  };

  const addMedication = (med) => {
    setMedications((prev) => [...prev, med]);
    fetchAndStoreLeaflet(med.id, med.name);
  };

  const fetchAndStoreLeaflet = async (medId, name) => {
    setLeafletLoadingIds((prev) => new Set(prev).add(medId));
    try {
      const info = await fetchLeafletInfo(name);
      setMedications((prev) => prev.map((m) => (m.id === medId ? { ...m, leaflet: info, leafletError: false } : m)));
    } catch (e) {
      setMedications((prev) => prev.map((m) => (m.id === medId ? { ...m, leafletError: true } : m)));
    } finally {
      setLeafletLoadingIds((prev) => { const n = new Set(prev); n.delete(medId); return n; });
    }
  };

  const weekDates = useMemo(() => {
    const ref = new Date(now);
    ref.setDate(ref.getDate() + weekOffset * 7);
    return getWeekDates(ref);
  }, [now.toDateString(), weekOffset]);

  const todaysDoses = useMemo(() => {
    const items = [];
    medications.forEach((med) => { if (isDayScheduled(med, now)) med.times.forEach((t) => items.push({ med, t, period: momentPeriod(t, periodBounds), sortValue: momentSortValue(t), status: getStatus(med, t, todayISO) })); });
    return items.sort((a, b) => a.sortValue - b.sortValue);
  }, [medications, todayISO, getStatus, periodBounds, now]);

  // Same shape as todaysDoses, generalized to any date — used by the week
  // view, which lists one day per row instead of one column per day.
  const dosesForDate = useCallback((d) => {
    const dISO = isoDate(d);
    const items = [];
    medications.forEach((med) => { if (isDayScheduled(med, d)) med.times.forEach((t) => items.push({ med, t, period: momentPeriod(t, periodBounds), sortValue: momentSortValue(t), status: getStatus(med, t, dISO) })); });
    return items.sort((a, b) => a.sortValue - b.sortValue);
  }, [medications, periodBounds, getStatus]);
  const todaysByPeriod = useMemo(() => {
    const map = { Ochtend: [], Middag: [], Avond: [], Nacht: [] };
    todaysDoses.forEach((d) => map[d.period].push(d));
    return map;
  }, [todaysDoses]);

  const medsScheduledToday = useMemo(() => medications.filter((m) => m.frequency !== "indien_nodig" && isDayScheduled(m, now)), [medications, now]);

  const progressByMed = useMemo(() => {
    const map = {};
    // Only meds actually due today get a progress jar — otherwise a
    // "vaste dagen" medication shows a perpetually-unfilled 0/N jar on
    // days it isn't even scheduled.
    medsScheduledToday.forEach((med) => { map[med.id] = { taken: 0, total: dosesPerDayFor(med) }; });
    todaysDoses.forEach((d) => { if (d.status === "taken" && map[d.med.id]) map[d.med.id].taken += (d.t.count || 1); });
    return map;
  }, [medsScheduledToday, todaysDoses]);

  // "Voortgang vandaag" is één gecombineerde pot voor alle medicatie samen
  // — bijv. 6 innames van medicijn X + 6 van medicijn Y wordt hier 12/12 —
  // in plaats van een aparte potje per medicijn. Alleen verborgen als er in
  // totaal maar 1 inname vandaag is, want dan is het gewoon een duplicaat
  // van het ene tappable potje hieronder.
  const combinedProgress = useMemo(() => medsScheduledToday.reduce((acc, med) => {
    const p = progressByMed[med.id] || { taken: 0, total: 1 };
    acc.taken += p.taken;
    acc.total += p.total;
    return acc;
  }, { taken: 0, total: 0 }), [medsScheduledToday, progressByMed]);

  const missedToday = todaysDoses.filter((d) => d.status === "missed");
  // A snoozed dose stays out of the "gemist" banner until its 15 minuten om zijn.
  const visibleMissed = missedToday.filter((d) => !(snoozedUntil[logKeyFor(d.med.id, todayISO, d.t)] > now.getTime()));
  // Every upcoming dose that shares the same moment (same maaltijd/tijdstip)
  // as the very next one is shown together — anders lijkt het net of er maar
  // 1 medicijn op dat moment moet, terwijl er meerdere tegelijk klaarstaan.
  const nextUpcomingGroup = useMemo(() => {
    const upcoming = todaysDoses.filter((d) => d.status === "upcoming").sort((a, b) => a.sortValue - b.sortValue);
    if (upcoming.length === 0) return [];
    const key = momentKeyPart(upcoming[0].t);
    return upcoming.filter((d) => momentKeyPart(d.t) === key);
  }, [todaysDoses]);
  const nextUpcoming = nextUpcomingGroup[0] || null;
  const takenToday = todaysDoses.filter((d) => d.status === "taken");
  const allDoneToday = medications.length > 0 && todaysDoses.length > 0 && takenToday.length === todaysDoses.length;
  const prevAllDoneRef = useRef(false);
  useEffect(() => {
    if (allDoneToday && !prevAllDoneRef.current) {
      setCelebrated(true);
      setTimeout(() => setCelebrated(false), 1200);
    }
    prevAllDoneRef.current = allDoneToday;
  }, [allDoneToday]);

  const prnMeds = medications.filter((m) => m.frequency === "indien_nodig");
  const prnToday = useMemo(() => {
    const map = {};
    prnMeds.forEach((med) => {
      const prefix = `${med.id}_${todayISO}_prn:`;
      const entries = Object.keys(log).filter((k) => k.startsWith(prefix) && log[k]?.taken).map((k) => log[k]);
      map[med.id] = { count: entries.length, lastKey: entries.length ? Object.keys(log).filter((k) => k.startsWith(prefix))[entries.length - 1] : null };
    });
    return map;
  }, [prnMeds, log, todayISO]);

  const streak = useMemo(() => {
    if (medications.length === 0) return 0;
    let count = 0;
    for (let back = 1; back <= 30; back++) {
      const d = new Date(now);
      d.setDate(d.getDate() - back);
      const dISO = isoDate(d);
      let allTaken = true, hadDoses = false;
      medications.forEach((med) => { if (isDayScheduled(med, d)) med.times.forEach((t) => {
        hadDoses = true;
        if (!log[logKeyFor(med.id, dISO, t)]?.taken) allTaken = false;
      }); });
      if (!hadDoses) break;
      if (allTaken) count++; else break;
    }
    return count;
  }, [medications, log, now]);

  const prevStreakRef = useRef(0);
  useEffect(() => {
    const milestones = [7, 14, 30, 60, 100];
    const crossed = milestones.find((m) => streak >= m && prevStreakRef.current < m);
    if (crossed) {
      setMilestoneHit(crossed);
      setTimeout(() => setMilestoneHit(null), 4000);
    }
    prevStreakRef.current = streak;
  }, [streak]);

  const medsWithSupply = useMemo(() => medications.map((m) => {
    const dosesPerDay = dosesPerDayFor(m);
    const daysLeft = typeof m.stock === "number" ? Math.floor(m.stock / dosesPerDay) : null;
    const autoThreshold = dosesPerDay * REFILL_LEAD_DAYS;
    const runOutDate = daysLeft != null ? new Date(now.getTime() + daysLeft * 86400000) : null;
    return { ...m, dosesPerDay, daysLeft, autoThreshold, runOutDate };
  }), [medications, now]);

  const lowStock = medsWithSupply.filter((m) => m.frequency !== "indien_nodig" && typeof m.stock === "number" && m.stock <= m.autoThreshold);
  const needsRefill = lowStock;

  useEffect(() => {
    if (!notifActive) return;
    needsRefill.forEach((m) => {
      const key = `refill_${m.id}_${todayISO}`;
      if (!refillFiredRef.current.has(key)) {
        refillFiredRef.current.add(key);
        const days = m.daysLeft <= 0 ? 0 : m.daysLeft;
        const date = m.runOutDate ? m.runOutDate.toLocaleDateString(LOCALE_MAP[language], { day: "numeric", month: "long" }) : "";
        try { new Notification(L("notif_refill_title", { name: m.name }), { body: L("notif_refill_body", { days, unit: L(days === 1 ? "stat_streak_days_one" : "stat_streak_days_other"), date }), tag: key }); } catch (e) {}
      }
    });
  }, [needsRefill, notifActive, todayISO, L, language]);

  const navigateTo = (key) => {
    setActiveNav(key);
    // Always land on the current week when switching into the week page.
    if (key === "week") setWeekOffset(0);
  };

  if (!loaded) return <div style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontFamily: "Inter, sans-serif" }}>{L("loading")}</div>;

  return (
    <ThemeContext.Provider value={T}>
    <LangContext.Provider value={language}>
    <div dir={RTL_LANGS.has(language) ? "rtl" : "ltr"} style={{ "--wd-text-scale": textScale, background: T.bg, minHeight: "100vh", fontFamily: "'Nunito', sans-serif", color: T.ink, paddingTop: "max(18px, env(safe-area-inset-top))", paddingLeft: 14, paddingRight: 14, paddingBottom: 96 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Nunito:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .wd-mono { font-family: 'IBM Plex Mono', monospace; }
        .wd-display { font-family: 'Quicksand', 'Nunito', sans-serif; }
        .wd-scroll::-webkit-scrollbar { height: 6px; }
        .wd-scroll::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        .wd-btn { transition: transform 0.15s ease, background 0.15s ease; }
        .wd-btn:active { transform: scale(0.96); }
        .wd-iconbtn { min-width: 40px; min-height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
        .wd-iconbtn:active { background: ${T.surfaceSoft}; }
        @keyframes wd-pop { 0% { transform: scale(1); } 45% { transform: scale(1.22); } 100% { transform: scale(1); } }
        .wd-pop { animation: wd-pop 0.4s cubic-bezier(.4,1.6,.5,1); }
        @keyframes wd-confetti-fall { 0% { transform: translateY(-6px) rotate(0deg); opacity: 1; } 100% { transform: translateY(46px) rotate(200deg); opacity: 0; } }
        .wd-confetti span { position: absolute; top: 0; display: block; width: 6px; height: 6px; border-radius: 2px; animation: wd-confetti-fall 0.9s ease-out forwards; }
        .wd-card { box-shadow: ${darkMode ? "0 3px 16px rgba(0,0,0,0.45)" : "0 1px 3px rgba(35,62,56,0.06)"}; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input::placeholder, select::placeholder, textarea::placeholder { color: ${T.mutedSoft}; opacity: 1; }
        @media print { .no-print { display: none !important; } }
      `}</style>

      <div className="no-print" style={{ maxWidth: 720, margin: "0 auto", zoom: 1.16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 10 }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {profiles.length > 1 && (
              <button onClick={() => setShowProfiles(true)} aria-label={L("profiles_title")} title={L("profiles_title")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                <AvatarBadge name={activeProfile?.name} color={activeProfile?.color || T.primary} size={36} />
              </button>
            )}
            <LanguagePicker language={language} onChange={setLanguage} />
            <IconToggleButton onClick={() => setDarkMode((v) => !v)} active={darkMode} icon={darkMode ? <Sun size={16} /> : <Moon size={16} />} label={darkMode ? L("theme_light") : L("theme_dark")} />
          </div>
        </div>

        {storageIssue && (
          <div style={{ background: T.warnSoft, border: `1.5px solid ${T.warn}55`, borderRadius: 16, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <AlertTriangle size={16} color={T.warn} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.warn, lineHeight: 1.4, flex: 1, minWidth: 200 }}>{L("storage_issue_text")}</div>
            <button className="wd-btn" onClick={() => window.location.reload()} style={{ background: T.warn, color: "#fff", border: "none", borderRadius: 10, padding: "9px 14px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>{L("storage_issue_retry")}</button>
          </div>
        )}

        {activeNav === "vandaag" && (
          <>
            <div style={{ fontSize: "calc(13px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 18 }}>{DAY_NAMES_BY_LANG[language][(now.getDay() + 6) % 7]} · {now.toLocaleDateString(LOCALE_MAP[language], { day: "numeric", month: "long" })}</div>

            {nextUpcomingGroup.length === 1 && (
              <div className="wd-card" style={{ background: T.primarySoft, border: `1.5px solid ${T.primary}55`, borderRadius: 18, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
                <Compartment status={nextUpcoming.status} color={nextUpcoming.med.color} size={44} onClick={() => toggleTaken(nextUpcoming.med, todayISO, nextUpcoming.t)} pop={poppedKey === logKeyFor(nextUpcoming.med.id, todayISO, nextUpcoming.t)} label={L("aria_dose_label", { name: nextUpcoming.med.name, moment: momentLabel(nextUpcoming.t, L), status: L("aria_dose_upcoming") })} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{L("home_next")}</div>
                  <div style={{ fontSize: "calc(15.5px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{nextUpcoming.med.name}</div>
                  <div className="wd-mono" style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.muted }}>{nextDoseTiming(nextUpcoming.t, now, todayISO, L)}</div>
                </div>
              </div>
            )}

            {nextUpcomingGroup.length > 1 && (
              <div className="wd-card" style={{ background: T.primarySoft, border: `1.5px solid ${T.primary}55`, borderRadius: 18, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{L("home_next")}</div>
                <div className="wd-mono" style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 10 }}>{nextDoseTiming(nextUpcoming.t, now, todayISO, L)}</div>
                {nextUpcomingGroup.map((d, i) => (
                  <div key={logKeyFor(d.med.id, todayISO, d.t)} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: i > 0 ? 10 : 0 }}>
                    <Compartment status={d.status} color={d.med.color} size={44} onClick={() => toggleTaken(d.med, todayISO, d.t)} pop={poppedKey === logKeyFor(d.med.id, todayISO, d.t)} label={L("aria_dose_label", { name: d.med.name, moment: momentLabel(d.t, L), status: L("aria_dose_upcoming") })} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "calc(15.5px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{d.med.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {medications.length > 0 && PERIOD_ORDER.some((p) => todaysByPeriod[p].length > 0) && (
              <>
                <SectionTitle>{L("home_section_today")}</SectionTitle>
                {PERIOD_ORDER.filter((p) => todaysByPeriod[p].length > 0).map((period) => {
                  const isCurrent = period === currentPeriod;
                  const items = todaysByPeriod[period];
                  const allTaken = items.every((d) => d.status === "taken");
                  const isCollapsed = allTaken && !expandedPeriods[period];
                  const periodLabel = L(PERIOD_KEY_MAP[period] || period);
                  return (
                    <div key={period} style={{ marginBottom: isCollapsed ? 10 : 20 }}>
                      {isCollapsed ? (
                        <button
                          className="wd-btn"
                          onClick={() => setExpandedPeriods((prev) => ({ ...prev, [period]: true }))}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: T.successSoft, border: `1.5px solid ${T.success}40`, borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontFamily: "inherit" }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.success }}><Check size={14} /> {L("home_period_all_taken", { period: periodLabel })}</span>
                          <span style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", color: T.muted }}>{items.length} {L(items.length === 1 ? "home_period_potjes_one" : "home_period_potjes_other")}</span>
                        </button>
                      ) : (
                        <>
                          <button
                            className={`wd-mono${allTaken ? " wd-btn" : ""}`}
                            onClick={allTaken ? () => setExpandedPeriods((prev) => ({ ...prev, [period]: false })) : undefined}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "calc(11.5px * var(--wd-text-scale, 1))", fontWeight: 700, color: isCurrent ? "#fff" : T.primary, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10, background: isCurrent ? T.primary : "transparent", borderRadius: 8, padding: isCurrent ? "4px 10px" : 0, border: "none", cursor: allTaken ? "pointer" : "default", fontFamily: "inherit" }}
                          >
                            {periodLabel}{allTaken && " ✓"}
                          </button>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 14 }}>
                            {items.map((d) => (
                              <div key={d.med.id + d.t.id} className="wd-card" style={{ background: T.surface, borderRadius: 18, padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: `1.5px solid ${isCurrent ? T.primary + "55" : T.border}` }}>
                                <AvatarBadge name={d.med.name} color={d.med.color} photo={d.med.photo} size={26} />
                                <Compartment status={d.status} color={d.med.color} size={isCurrent ? 56 : 46} onClick={() => toggleTaken(d.med, todayISO, d.t)} pop={poppedKey === logKeyFor(d.med.id, todayISO, d.t)} label={L("aria_dose_label", { name: d.med.name, moment: momentLabel(d.t, L), status: statusLabel(d.status, L) })} />
                                <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, textAlign: "center" }}>{d.med.name}</div>
                                <div className={isMeal(d.t) ? "" : "wd-mono"} style={{ fontSize: isMeal(d.t) ? "calc(11px * var(--wd-text-scale, 1))" : "calc(11.5px * var(--wd-text-scale, 1))", color: T.muted, textAlign: "center" }}>{momentLabel(d.t, L)}</div>
                                {doseLabel(d.med, d.t, L) && <div style={{ fontSize: "calc(10.5px * var(--wd-text-scale, 1))", fontWeight: 600, color: T.muted, textAlign: "center" }}>{doseLabel(d.med, d.t, L)}</div>}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <StatTile icon={<Check size={13} />} label={L("stat_taken")} value={`${takenToday.length}/${todaysDoses.length || 0}`} color={T.primary} bg={T.primarySoft} />
              <StatTile icon={streak >= 3 ? <Flame size={13} /> : <Clock size={13} />} label={L("stat_streak")} value={`${streak} ${L(streak === 1 ? "stat_streak_days_one" : "stat_streak_days_other")}`} color={streak >= 3 ? T.gold : T.success} bg={streak >= 3 ? T.goldSoft : T.successSoft} />
              <StatTile icon={notifActive ? <Bell size={13} /> : <BellOff size={13} />} label={L("stat_notif")} value={notifActive ? L("stat_notif_on") : L("stat_notif_off")} color={notifActive ? T.primary : T.muted} bg={notifActive ? T.primarySoft : T.surfaceSoft} onClick={requestNotif} />
            </div>

            {milestoneHit && (
              <div style={{ position: "relative", overflow: "hidden", background: T.goldSoft, border: `1.5px solid ${T.gold}66`, borderRadius: 16, padding: "15px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <Flame size={20} color={T.gold} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: "calc(14px * var(--wd-text-scale, 1))", fontWeight: 700, color: "#8A6420" }}>{L("milestone_text", { n: milestoneHit })}</div>
                <div className="wd-confetti" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span key={i} style={{ left: `${(i * 6.3 + 2) % 100}%`, background: [T.gold, T.primary, T.success, T.warn][i % 4], animationDelay: `${(i % 6) * 0.06}s` }} />
                  ))}
                </div>
              </div>
            )}

            {allDoneToday && (
              <div style={{ position: "relative", overflow: "hidden", background: T.successSoft, border: `1.5px solid ${T.success}55`, borderRadius: 16, padding: "15px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <PartyPopper size={20} color={T.success} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: "calc(14px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.success }}>{L("alldone_text")}</div>
                {celebrated && (
                  <div className="wd-confetti" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span key={i} style={{ left: `${(i * 6.3 + 2) % 100}%`, background: [T.primary, T.gold, T.success, T.warn][i % 4], animationDelay: `${(i % 6) * 0.06}s` }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {visibleMissed.length > 0 && (
              <div style={{ background: T.warnSoft, border: `1.5px solid ${T.warn}33`, borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.warn, fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", marginBottom: 8 }}><AlertTriangle size={16} /> {L(visibleMissed.length === 1 ? "missed_count_one" : "missed_count_other", { n: visibleMissed.length })}</div>
                {visibleMissed.map((d) => (
                  <div key={d.med.id + d.t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))"}}><span style={{ fontWeight: 600 }}>{d.med.name}</span> <span style={{ color: T.muted }} className={isMeal(d.t) ? "" : "wd-mono"}>{momentLabel(d.t, L)}</span></div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button className="wd-btn" onClick={() => snoozeDose(d.med, d.t)} style={{ background: "none", color: T.warn, border: `1.5px solid ${T.warn}55`, borderRadius: 10, padding: "9px 12px", fontSize: "calc(12px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: "pointer" }}>{L("missed_snooze")}</button>
                      <button className="wd-btn" onClick={() => toggleTaken(d.med, todayISO, d.t)} style={{ background: T.warn, color: "#fff", border: "none", borderRadius: 10, padding: "9px 14px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: "pointer" }}>{L("missed_taken_anyway")}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {needsRefill.length > 0 && (
              <div style={{ background: T.goldSoft, border: `1.5px solid ${T.gold}55`, borderRadius: 16, padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8A6420", fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", marginBottom: 8 }}><Package size={16} /> {L("refill_title")}</div>
                {needsRefill.map((m) => (
                  <div key={m.id} style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", padding: "4px 0" }}><span style={{ fontWeight: 600 }}>{m.name}</span> <span style={{ color: "#8A6420" }}>{L("refill_days_left", { days: m.daysLeft <= 0 ? "0" : m.daysLeft, unit: L(m.daysLeft === 1 ? "stat_streak_days_one" : "stat_streak_days_other"), date: m.runOutDate ? m.runOutDate.toLocaleDateString(LOCALE_MAP[language], { day: "numeric", month: "long" }) : "" })}</span></div>
                ))}
              </div>
            )}

            {medications.length === 0 && (
              <div className="wd-card" style={{ background: T.surface, border: `1.5px dashed ${T.border}`, borderRadius: 20, padding: "36px 20px", textAlign: "center", marginBottom: 20 }}>
                <div className="wd-display" style={{ fontSize: "calc(18px * var(--wd-text-scale, 1))", fontWeight: 600, marginBottom: 6 }}>{L("empty_no_meds_title")}</div>
                <div style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 16 }}>{L("empty_no_meds_body")}</div>
                <button className="wd-btn" onClick={() => setShowAdd(true)} style={{ background: T.primary, color: "#fff", border: "none", borderRadius: 14, padding: "14px 22px", fontWeight: 700, fontSize: "calc(15px * var(--wd-text-scale, 1))", cursor: "pointer" }}>{L("empty_add_med_button")}</button>
              </div>
            )}

            {medications.length > 0 && (
              <>
                {medsScheduledToday.length > 0 && combinedProgress.total > 1 && (
                  <>
                    <SectionTitle>{L("progress_today_title")}</SectionTitle>
                    <div className="wd-card" style={{ background: T.surface, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, marginBottom: 24, border: `1.5px solid ${T.border}` }}>
                      <ProgressJar color={T.primary} taken={combinedProgress.taken} total={combinedProgress.total} size={58} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="wd-mono" style={{ fontSize: "calc(19px * var(--wd-text-scale, 1))", fontWeight: 700, color: combinedProgress.taken >= combinedProgress.total ? T.success : T.ink }}>{combinedProgress.taken}/{combinedProgress.total}</div>
                        <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted, marginTop: 2 }}>{L(medsScheduledToday.length === 1 ? "progress_today_combined_meds_one" : "progress_today_combined_meds_other", { n: medsScheduledToday.length })}</div>
                      </div>
                    </div>
                  </>
                )}

                {prnMeds.length > 0 && (
                  <>
                    <SectionTitle>{L("prn_title")}</SectionTitle>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {prnMeds.map((med) => {
                        const info = prnToday[med.id] || { count: 0 };
                        return (
                          <div key={med.id} className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <AvatarBadge name={med.name} color={med.color} photo={med.photo} size={36} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: "calc(14px * var(--wd-text-scale, 1))"}}>{med.name}</div>
                              <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.muted }}>{doseLabel(med, { count: med.prnDoseCount }, L)}{info.count > 0 ? ` ${L("prn_today_count", { n: info.count })}` : ` ${L("prn_not_taken_today")}`}</div>
                              {info.count > 0 && <button onClick={() => undoLastPRN(med)} style={{ background: "none", border: "none", color: T.mutedSoft, fontSize: "calc(11px * var(--wd-text-scale, 1))", padding: "4px 0", cursor: "pointer" }}>{L("prn_undo")}</button>}
                            </div>
                            <button className="wd-btn" onClick={() => logPRN(med)} style={{ background: T.primary, color: "#fff", border: "none", borderRadius: 12, padding: "12px 16px", fontWeight: 700, fontSize: "calc(13px * var(--wd-text-scale, 1))", cursor: "pointer", flexShrink: 0, minHeight: 44 }}>{L("prn_take_now")}</button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {activeNav === "week" && (
          <>
            <SectionTitle>{L("week_title")}</SectionTitle>
            {medications.length === 0 ? (
              <div className="wd-card" style={{ background: T.surface, border: `1.5px dashed ${T.border}`, borderRadius: 20, padding: "36px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", color: T.muted }}>{L("week_empty")}</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
                  <button className="wd-btn" onClick={() => setWeekOffset((o) => Math.max(-12, o - 1))} disabled={weekOffset <= -12} style={{ background: T.surfaceSoft, border: `1.5px solid ${T.border}`, color: weekOffset <= -12 ? T.mutedSoft : T.ink, borderRadius: 10, padding: "9px 14px", fontSize: "calc(13px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: weekOffset <= -12 ? "not-allowed" : "pointer", minHeight: 40 }}>{L("week_prev")}</button>
                  <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.muted }}>{weekOffset === 0 ? L("week_this") : weekOffset === -1 ? L("week_last") : L("week_weeks_ago", { n: Math.abs(weekOffset) })}</div>
                  <button className="wd-btn" onClick={() => setWeekOffset((o) => Math.min(0, o + 1))} disabled={weekOffset >= 0} style={{ background: T.surfaceSoft, border: `1.5px solid ${T.border}`, color: weekOffset >= 0 ? T.mutedSoft : T.ink, borderRadius: 10, padding: "9px 14px", fontSize: "calc(13px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: weekOffset >= 0 ? "not-allowed" : "pointer", minHeight: 40 }}>{L("week_next")}</button>
                </div>

                <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "14px 12px", marginBottom: 16 }}>
                  <div style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>{L("week_trend_title")}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 6 }}>
                    {weekDates.map((d, i) => {
                      const dISO = isoDate(d);
                      const isToday = dISO === todayISO;
                      const isFuture = dISO > todayISO;
                      const dayDoses = dosesForDate(d);
                      const scheduled = dayDoses.length;
                      const taken = dayDoses.filter((it) => it.status === "taken").length;
                      const pct = scheduled === 0 ? 0 : Math.round((taken / scheduled) * 100);
                      const showBar = !isFuture && scheduled > 0;
                      const barColor = pct >= 80 ? T.success : pct >= 50 ? T.gold : T.warn;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }} title={showBar ? `${DAY_NAMES_BY_LANG[language][i]}: ${taken}/${scheduled} (${pct}%)` : undefined}>
                          <div style={{ width: "100%", maxWidth: 26, height: 52, background: T.surfaceSoft, borderRadius: 6, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                            {showBar && <div style={{ width: "100%", height: `${Math.max(pct, 6)}%`, background: barColor, borderRadius: "6px 6px 0 0" }} />}
                          </div>
                          <div className="wd-mono" style={{ fontSize: "calc(9.5px * var(--wd-text-scale, 1))", fontWeight: isToday ? 700 : 600, color: isToday ? T.primary : T.muted }}>{DAY_SHORT_BY_LANG[language][i]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {weekDates.map((d, i) => {
                    const dISO = isoDate(d);
                    const isToday = dISO === todayISO;
                    const dayDoses = dosesForDate(d);
                    const dayByPeriod = { Ochtend: [], Middag: [], Avond: [], Nacht: [] };
                    dayDoses.forEach((it) => dayByPeriod[it.period].push(it));
                    return (
                      <div key={i} className="wd-card" style={{ background: T.surface, border: `1.5px solid ${isToday ? T.primary : T.border}`, borderRadius: 16, padding: "13px 15px" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: dayDoses.length > 0 ? 10 : 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", color: isToday ? T.primary : T.ink }}>{DAY_NAMES_BY_LANG[language][i]}</div>
                          <div className="wd-mono" style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.muted }}>{d.toLocaleDateString(LOCALE_MAP[language], { day: "numeric", month: "short" })}</div>
                          {isToday && <span style={{ marginLeft: "auto", fontSize: "calc(10.5px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.primary, background: T.primarySoft, borderRadius: 8, padding: "3px 9px", flexShrink: 0 }}>{L("week_today_badge")}</span>}
                        </div>
                        {dayDoses.length === 0 ? (
                          <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted }}>{L("week_no_meds_day")}</div>
                        ) : (
                          PERIOD_ORDER.filter((p) => dayByPeriod[p].length > 0).map((period) => (
                            <div key={period} style={{ marginBottom: 10 }}>
                              <div className="wd-mono" style={{ fontSize: "calc(10px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{L(PERIOD_KEY_MAP[period] || period)}</div>
                              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                {dayByPeriod[period].map((it) => (
                                  <div key={it.med.id + it.t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 54 }}>
                                    <Compartment status={it.status} color={it.med.color} size={38} onClick={() => toggleTaken(it.med, dISO, it.t)} pop={poppedKey === logKeyFor(it.med.id, dISO, it.t)} label={L("aria_dose_label", { name: it.med.name, moment: `${DAY_NAMES_BY_LANG[language][i]} ${momentLabel(it.t, L)}`, status: statusLabel(it.status, L) })} />
                                    <div style={{ fontSize: "calc(9.5px * var(--wd-text-scale, 1))", fontWeight: 600, color: T.ink, textAlign: "center", lineHeight: 1.2, wordBreak: "break-word" }}>{it.med.name}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {activeNav === "beheer" && (
          <>
            <SectionTitle>{L("beheer_title")}</SectionTitle>
            {medications.length > 4 && (
              <div style={{ position: "relative", marginBottom: 14 }}>
                <Search size={16} color={T.mutedSoft} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={beheerSearch} onChange={(e) => setBeheerSearch(e.target.value)} placeholder={L("beheer_search_placeholder")} style={{ ...getInputStyle(T), paddingLeft: 38 }} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {medications.filter((med) => med.name.toLowerCase().includes(beheerSearch.trim().toLowerCase())).length === 0 && beheerSearch.trim() && (
                <div className="wd-card" style={{ background: T.surface, border: `1.5px dashed ${T.border}`, borderRadius: 16, padding: "24px 16px", textAlign: "center", fontSize: "calc(13px * var(--wd-text-scale, 1))", color: T.muted }}>{L("beheer_search_empty", { q: beheerSearch.trim() })}</div>
              )}
              {medications.filter((med) => med.name.toLowerCase().includes(beheerSearch.trim().toLowerCase())).map((med) => (
                <div key={med.id} className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "12px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", rowGap: 8, gap: 12 }}>
                    <AvatarBadge name={med.name} color={med.color} photo={med.photo} size={34} />
                    <div style={{ flex: "1 1 140px", minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "calc(14.5px * var(--wd-text-scale, 1))"}}>{med.name}</div>
                      <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.muted }}>
                        {med.frequency === "indien_nodig" ? (
                          <>{L("beheer_prn_summary")} · {doseLabel(med, { count: med.prnDoseCount }, L)}</>
                        ) : med.frequency === "weekdagen" ? (
                          <>{L("beheer_per_day", { n: med.totalPerDay, unit: unitWordFor(med, med.totalPerDay, L) })} · {(med.weekdays || []).map((d) => DAY_SHORT_BY_LANG[language][d]).join(", ") || L("beheer_no_weekdays")} · {med.times.map((t) => momentLabel(t, L)).join(", ")}</>
                        ) : (
                          <>{L("beheer_per_day", { n: med.totalPerDay, unit: unitWordFor(med, med.totalPerDay, L) })} · {med.times.map((t) => momentLabel(t, L)).join(", ")}</>
                        )}
                        {typeof med.stock === "number" && (
                          med.frequency === "indien_nodig" ? (
                            <span style={{ color: med.stock <= 0 ? T.warn : T.muted, fontWeight: med.stock <= 0 ? 700 : 400 }}> {L("beheer_stock", { n: med.stock })}</span>
                          ) : (
                            <span style={{ color: med.stock <= dosesPerDayFor(med) * REFILL_LEAD_DAYS ? T.warn : T.muted, fontWeight: med.stock <= dosesPerDayFor(med) * REFILL_LEAD_DAYS ? 700 : 400 }}> {L("beheer_stock", { n: med.stock })}</span>
                          )
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", flexShrink: 0, marginLeft: "auto" }}>
                      <button className="wd-btn wd-iconbtn" onClick={() => setExpandedLeaflet(expandedLeaflet === med.id ? null : med.id)} title={L("beheer_leaflet_title")} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", flexShrink: 0 }}><BookOpen size={18} /></button>
                      <button className="wd-btn wd-iconbtn" onClick={() => setRestockMed(med)} title={L("beheer_restock_title")} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", flexShrink: 0 }}><PackagePlus size={18} /></button>
                      <button className="wd-btn wd-iconbtn" onClick={() => setEditingMed(med)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", flexShrink: 0 }}><Pencil size={18} /></button>
                      <button className="wd-btn wd-iconbtn" onClick={() => setMedications((prev) => prev.filter((m) => m.id !== med.id))} style={{ background: "none", border: "none", color: T.warn, cursor: "pointer", flexShrink: 0 }}><Trash2 size={18} /></button>
                    </div>
                  </div>
                  {expandedLeaflet === med.id && <LeafletPanel med={med} loading={leafletLoadingIds.has(med.id)} onRetry={() => fetchAndStoreLeaflet(med.id, med.name)} />}
                </div>
              ))}
              <button className="wd-btn" onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.primarySoft, color: T.primary, border: `1.5px dashed ${T.primary}66`, borderRadius: 14, padding: "14px", fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: "pointer" }}><Plus size={18} /> {L("beheer_add_button")}</button>
            </div>
          </>
        )}

        {activeNav === "instellingen" && (
          <>
            <SectionTitle>{L("settings_title")}</SectionTitle>

            <SectionTitle>{L("settings_accessibility_title")}</SectionTitle>
            <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
              <div style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", fontWeight: 600, marginBottom: 10 }}>{L("settings_textsize_label")}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["normaal", "groot", "extra-groot"].map((size) => (
                  <button key={size} type="button" onClick={() => setTextSize(size)} style={getToggleBtnStyle(T, textSize === size)}>
                    {L(size === "normaal" ? "textsize_normaal" : size === "groot" ? "textsize_groot" : "textsize_extra_groot")}
                  </button>
                ))}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", minHeight: 24 }}>
                <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} style={{ width: 20, height: 20, accentColor: T.primary }} />
                <span style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", fontWeight: 600 }}>{L("settings_contrast_toggle")}</span>
              </label>
              <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.mutedSoft, lineHeight: 1.4, marginTop: 8 }}>{L("settings_contrast_explain")}</div>
            </div>

            <SectionTitle>{L("profiles_title")}</SectionTitle>
            <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <AvatarBadge name={activeProfile?.name} color={activeProfile?.color || T.primary} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeProfile?.name}</div>
                  <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.primary }}>{L("profiles_active_badge")}</div>
                </div>
              </div>
              <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.mutedSoft, lineHeight: 1.4, marginBottom: 14 }}>{L("profiles_manage_explain")}</div>
              <button className="wd-btn" onClick={() => setShowProfiles(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: T.primarySoft, color: T.primary, border: `1.5px dashed ${T.primary}66`, borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: "pointer" }}><Users size={18} /> {L("settings_profiles_manage_button")}</button>
            </div>

            <SectionTitle>{L("settings_notif_title")}</SectionTitle>
            <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: !notifActive ? 8 : 0 }}>
                <span style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", fontWeight: 600 }}>{L("settings_notif_label")}</span>
                <IconToggleButton onClick={requestNotif} active={notifActive} icon={notifActive ? <Bell size={16} /> : <BellOff size={16} />} label={notifPerm === "denied" ? L("settings_notif_denied_label") : notifActive ? L("stat_notif_on") : notifPerm === "granted" ? L("stat_notif_off") : L("settings_notif_enable")} />
              </div>
              {notifPerm === "denied" ? (
                <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.warn, lineHeight: 1.4 }}>{L("settings_notif_denied")}</div>
              ) : !notifActive && (
                <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.mutedSoft, lineHeight: 1.4 }}>{L("settings_notif_explain")}</div>
              )}
            </div>

            <SectionTitle>{L("settings_home_title")}</SectionTitle>
            <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
              {isStandalone ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.success, fontWeight: 600, fontSize: "calc(13px * var(--wd-text-scale, 1))"}}><Check size={16} /> {L("settings_install_already")}</div>
              ) : installPromptEvent ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.primary, fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", marginBottom: 8 }}><Smartphone size={17} /> {L("settings_home_headline")}</div>
                  <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.ink, lineHeight: 1.5, marginBottom: 12 }}>{L("settings_install_explain")}</div>
                  <button className="wd-btn" onClick={handleInstallClick} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: T.primary, color: "#fff", border: "none", borderRadius: 12, padding: "13px 14px", fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: "pointer", minHeight: 44 }}><Download size={17} /> {L("settings_install_button")}</button>
                </>
              ) : !homeTipDismissed ? (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.primary, fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))"}}><Smartphone size={17} /> {L("settings_home_headline")}</div>
                    <button className="wd-iconbtn" onClick={() => setHomeTipDismissed(true)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", flexShrink: 0 }}><X size={16} /></button>
                  </div>
                  <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.ink, lineHeight: 1.5 }}>
                    <strong>iPhone:</strong> {L("settings_home_iphone")}<br />
                    <strong>Android:</strong> {L("settings_home_android")}<br />
                    {L("settings_home_footer")}
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted }}>{L("settings_home_hidden")}</div>
                  <button onClick={() => setHomeTipDismissed(false)} style={{ background: "none", border: "none", color: T.primary, fontWeight: 600, fontSize: "calc(12.5px * var(--wd-text-scale, 1))", cursor: "pointer", flexShrink: 0 }}>{L("settings_home_show_again")}</button>
                </div>
              )}
            </div>

            <SectionTitle>{L("settings_backup_title")}</SectionTitle>
            <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
              <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 12, lineHeight: 1.4 }}>{L("settings_backup_explain")}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="wd-btn" onClick={handleExport} disabled={medications.length === 0} style={{ display: "flex", alignItems: "center", gap: 6, background: medications.length === 0 ? T.mutedSoft : T.primarySoft, color: medications.length === 0 ? "#fff" : T.primary, border: "none", borderRadius: 10, padding: "10px 14px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: medications.length === 0 ? "not-allowed" : "pointer" }}><Download size={15} /> {L("settings_backup_export")}</button>
                <label style={{ display: "flex", alignItems: "center", gap: 6, background: T.surfaceSoft, color: T.muted, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: "pointer" }}>
                  <Upload size={15} /> {L("settings_backup_import")}
                  <input type="file" accept="application/json" onChange={handleImportFile} style={{ display: "none" }} />
                </label>
              </div>
              {medications.length > 0 && (() => {
                const daysSince = lastBackupAt ? Math.floor((now - new Date(lastBackupAt)) / 86400000) : null;
                const needsNudge = daysSince === null || daysSince >= 30;
                const text = daysSince === null ? L("settings_backup_never") : daysSince === 0 ? L("settings_backup_today") : daysSince === 1 ? L("settings_backup_yesterday") : L("settings_backup_days_ago", { n: daysSince });
                return <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", fontWeight: needsNudge ? 700 : 500, color: needsNudge ? T.warn : T.mutedSoft, marginTop: 10 }}>{text}{needsNudge ? L("settings_backup_nudge") : ""}</div>;
              })()}
            </div>

            <SectionTitle>{L("settings_calendar_title")}</SectionTitle>
            <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", minHeight: 24, marginBottom: 12 }}>
                <input type="checkbox" checked={icsExportEnabled} onChange={(e) => setIcsExportEnabled(e.target.checked)} style={{ width: 20, height: 20, accentColor: T.primary }} />
                <span style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", fontWeight: 600 }}>{L("settings_calendar_toggle")}</span>
              </label>
              <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.mutedSoft, lineHeight: 1.4, marginBottom: icsExportEnabled ? 14 : 0 }}>{L("settings_calendar_explain")}</div>
              {icsExportEnabled && (
                <button className="wd-btn" onClick={handleIcsExport} disabled={medications.length === 0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: medications.length === 0 ? T.mutedSoft : T.primarySoft, color: medications.length === 0 ? "#fff" : T.primary, border: "none", borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: medications.length === 0 ? "not-allowed" : "pointer" }}><Calendar size={17} /> {L("settings_calendar_export_button")}</button>
              )}
            </div>

            <div onClick={() => setSettingsOpen((v) => !v)} style={{ cursor: "pointer" }}>
              <SectionTitle trailing={settingsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}>{L("settings_periods_title")}</SectionTitle>
            </div>
            {settingsOpen && (
              <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 24 }}>
                <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 12, lineHeight: 1.4 }}>{L("settings_periods_explain")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {PERIOD_ORDER.map((p) => (
                    <div key={p}>
                      <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", fontWeight: 600, color: T.muted, marginBottom: 4 }}>{L("settings_periods_from", { period: L(PERIOD_KEY_MAP[p] || p) })}</div>
                      <input type="time" value={periodBounds[p]} onChange={(e) => setPeriodBounds((prev) => ({ ...prev, [p]: e.target.value }))} style={getInputStyle(T)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <SectionTitle>{L("settings_emergency_title")}</SectionTitle>
            <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
              <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 14, lineHeight: 1.4 }}>{L("settings_emergency_explain")}</div>
              <Field label={L("field_allergies")}><input value={emergencyInfo.allergies} onChange={(e) => setEmergencyInfo((p) => ({ ...p, allergies: e.target.value }))} placeholder={L("field_allergies_placeholder")} style={getInputStyle(T)} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label={L("field_contact_name")}><input value={emergencyInfo.contactName} onChange={(e) => setEmergencyInfo((p) => ({ ...p, contactName: e.target.value }))} placeholder={L("field_name_placeholder")} style={getInputStyle(T)} /></Field>
                <Field label={L("field_contact_phone")}><input type="tel" value={emergencyInfo.contactPhone} onChange={(e) => setEmergencyInfo((p) => ({ ...p, contactPhone: e.target.value }))} placeholder="06-..." style={getInputStyle(T)} /></Field>
                <Field label={L("field_doctor_name")}><input value={emergencyInfo.doctorName} onChange={(e) => setEmergencyInfo((p) => ({ ...p, doctorName: e.target.value }))} placeholder={L("field_practice_placeholder")} style={getInputStyle(T)} /></Field>
                <Field label={L("field_doctor_phone")}><input type="tel" value={emergencyInfo.doctorPhone} onChange={(e) => setEmergencyInfo((p) => ({ ...p, doctorPhone: e.target.value }))} placeholder="0..." style={getInputStyle(T)} /></Field>
                <Field label={L("field_pharmacy_name")}><input value={emergencyInfo.pharmacyName} onChange={(e) => setEmergencyInfo((p) => ({ ...p, pharmacyName: e.target.value }))} placeholder={L("field_pharmacy_placeholder")} style={getInputStyle(T)} /></Field>
                <Field label={L("field_pharmacy_phone")}><input type="tel" value={emergencyInfo.pharmacyPhone} onChange={(e) => setEmergencyInfo((p) => ({ ...p, pharmacyPhone: e.target.value }))} placeholder="0..." style={getInputStyle(T)} /></Field>
              </div>
              <button className="wd-btn" onClick={() => setShowEmergencyCard(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: T.warnSoft, border: `1.5px solid ${T.warn}55`, color: T.warn, borderRadius: 12, padding: "13px 14px", fontWeight: 700, fontSize: "calc(13.5px * var(--wd-text-scale, 1))", cursor: "pointer", minHeight: 44, marginTop: 4 }}><AlertTriangle size={16} /> {L("settings_emergency_view_button")}</button>
            </div>

            <SectionTitle>{L("settings_trend_title")}</SectionTitle>
            <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
              {medications.length === 0 ? (
                <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted, textAlign: "center", padding: "10px 0" }}>{L("settings_trend_empty")}</div>
              ) : (
                <AdherenceTrend medications={medications} log={log} now={now} periodBounds={periodBounds} />
              )}
            </div>

            <SectionTitle>{L("settings_report_title")}</SectionTitle>
            <button className="wd-btn" onClick={() => setShowReport(true)} disabled={medications.length === 0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: medications.length === 0 ? T.mutedSoft : T.surface, border: `1.5px solid ${T.border}`, color: T.ink, borderRadius: 14, padding: "15px", fontWeight: 600, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: medications.length === 0 ? "not-allowed" : "pointer", marginBottom: 10 }}><Printer size={17} /> {L("settings_report_button")}</button>
          </>
        )}
      </div>

      {(showAdd || editingMed) && (
        <MedModal
          initial={editingMed}
          periodBounds={periodBounds}
          medNameOptions={customMedNames}
          onClose={() => { setShowAdd(false); setEditingMed(null); }}
          onSave={(med) => {
            const known = customMedNames;
            if (med.name && !known.some((n) => n.toLowerCase() === med.name.toLowerCase())) {
              setCustomMedNames((prev) => [...prev, med.name]);
            }
            if (editingMed) setMedications((prev) => prev.map((m) => (m.id === med.id ? med : m)));
            else addMedication(med);
            setShowAdd(false);
            setEditingMed(null);
          }}
        />
      )}

      {restockMed && <RestockModal med={restockMed} onClose={() => setRestockMed(null)} onConfirm={(amt) => applyRestock(restockMed, amt)} />}

      {showReport && <ReportView medications={medications} log={log} now={now} periodBounds={periodBounds} onClose={() => setShowReport(false)} />}

      {showEmergencyCard && <EmergencyCardView medications={medications} info={emergencyInfo} onClose={() => setShowEmergencyCard(false)} />}

      {showProfiles && <ProfileModal profiles={profiles} activeProfileId={activeProfileId} onSwitch={switchProfile} onAdd={addProfile} onRename={renameProfile} onDelete={deleteProfile} onClose={() => setShowProfiles(false)} />}

      {undoToast && (
        <div className="no-print" style={{ position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: 86, zIndex: 55, background: T.ink, color: T.bg, borderRadius: 14, padding: "11px 8px 11px 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.28)", maxWidth: "calc(100% - 28px)", width: 380 }}>
          <Check size={16} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{L("undo_toast_text", { name: undoToast.med.name })}</div>
          <button className="wd-btn" onClick={() => { toggleTaken(undoToast.med, undoToast.dateISO, undoToast.t); hideUndoToast(); }} style={{ background: "none", border: "none", color: "inherit", fontWeight: 700, fontSize: "calc(12.5px * var(--wd-text-scale, 1))", cursor: "pointer", flexShrink: 0, textDecoration: "underline", padding: "6px 4px" }}>{L("undo_toast_button")}</button>
          <button className="wd-iconbtn" onClick={hideUndoToast} aria-label={L("undo_toast_dismiss")} style={{ background: "none", border: "none", color: "inherit", opacity: 0.65, cursor: "pointer", flexShrink: 0, minWidth: 32, minHeight: 32 }}><X size={15} /></button>
        </div>
      )}

      <BottomNav active={activeNav} onNavigate={navigateTo} />
    </div>
    </LangContext.Provider>
    </ThemeContext.Provider>
  );
}

function LeafletPanel({ med, loading, onRetry }) {
  const T = useThemeColors();
  const L = useL();
  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
      {loading && <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted }}>{L("leaflet_loading")}</div>}
      {!loading && med.leafletError && (
        <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.warn, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>{L("leaflet_fetch_failed")} <button className="wd-btn" onClick={onRetry} style={{ background: "none", border: "none", color: T.primary, fontWeight: 600, cursor: "pointer", padding: "6px 0" }}>{L("leaflet_retry")}</button></div>
      )}
      {!loading && med.leaflet && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <LeafletRow label={L("leaflet_use")} text={med.leaflet.gebruik} />
          <LeafletRow label={L("leaflet_dosage")} text={med.leaflet.dosering} />
          <LeafletRow label={L("leaflet_side_effects")} text={med.leaflet.bijwerkingen} />
          <LeafletRow label={L("leaflet_warning")} text={med.leaflet.waarschuwing} />
          <div style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", color: T.mutedSoft, fontStyle: "italic", marginTop: 2 }}>{L("leaflet_disclaimer")}</div>
          <a href={`https://www.apotheek.nl/zoeken?query=${encodeURIComponent(med.name)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.primary, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none", padding: "6px 0" }}>{L("leaflet_official_link")} <ExternalLink size={12} /></a>
        </div>
      )}
      {!loading && !med.leaflet && !med.leafletError && <button className="wd-btn" onClick={onRetry} style={{ background: T.primarySoft, color: T.primary, border: "none", borderRadius: 10, padding: "9px 14px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: "pointer" }}>{L("leaflet_fetch_button")}</button>}
    </div>
  );
}
function LeafletRow({ label, text }) {
  const T = useThemeColors();
  if (!text) return null;
  return <div><div style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div><div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.ink }}>{text}</div></div>;
}

// ---------- Wordmark, drawn from the exact same jar+lid geometry as
// Compartment/ProgressJar (same viewBox, body rect and lid constants) so the
// logo reads as one family with the potjes used throughout the app — just
// recolored in the brand's own green/goud two-tone instead of the neutral
// surface colors the potjes use, which is what gave the old logo its
// character in the first place. ----------
function Logo() {
  const T = useThemeColors();
  const lidX = 10, lidY = 10, lidW = 24, lidH = 9, lidRx = 4.5;
  const groove = "rgba(0,0,0,0.16)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <svg viewBox="0 0 44 52" width={30} height={35.5} style={{ flexShrink: 0, overflow: "visible" }}>
        <rect x="6" y="18" width="32" height="30" rx="11" fill={T.primary} />
        <rect x="9" y="21" width="8" height="24" rx="4" fill="#ffffff" opacity="0.14" />
        <rect x={lidX} y={lidY} width={lidW} height={lidH} rx={lidRx} fill={T.gold} />
        <rect x={lidX + 3} y={lidY + 1.6} width={lidW - 6} height="2.4" rx="1.2" fill="#ffffff" opacity="0.32" />
        <line x1={lidX + 6} y1={lidY + 2.5} x2={lidX + 6} y2={lidY + lidH - 2.5} stroke={groove} strokeWidth="1.2" strokeLinecap="round" />
        <line x1={lidX + 12} y1={lidY + 2.5} x2={lidX + 12} y2={lidY + lidH - 2.5} stroke={groove} strokeWidth="1.2" strokeLinecap="round" />
        <line x1={lidX + 18} y1={lidY + 2.5} x2={lidX + 18} y2={lidY + lidH - 2.5} stroke={groove} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="wd-display" style={{ fontSize: "calc(24px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.ink, lineHeight: 1 }}>MedBox</span>
    </div>
  );
}

function IconToggleButton({ onClick, active, icon, label }) {
  const T = useThemeColors();
  return <button className="wd-btn" onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, background: active ? T.primarySoft : T.surface, border: `1.5px solid ${active ? T.primary : T.border}`, color: active ? T.primary : T.muted, borderRadius: 12, padding: "10px 13px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: "pointer", minHeight: 40 }}>{icon} {label}</button>;
}

// Compact flag+code button, same visual weight as IconToggleButton, opening a
// small anchored sheet listing all LANGUAGES — kept intentionally lighter
// than RestockModal/MedModal since it's just a 7-item picker.
function LanguagePicker({ language, onChange }) {
  const T = useThemeColors();
  const L = useL();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        className="wd-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={L("lang_button")}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{ display: "flex", alignItems: "center", gap: 6, background: open ? T.primarySoft : T.surface, border: `1.5px solid ${open ? T.primary : T.border}`, color: open ? T.primary : T.muted, borderRadius: 12, padding: "10px 13px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: "pointer", minHeight: 40 }}
      >
        <span style={{ fontSize: "calc(15px * var(--wd-text-scale, 1))", lineHeight: 1 }}>{current.flag}</span> {current.code.toUpperCase()}
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={L("lang_button")}
          className="wd-card"
          style={{ position: "absolute", top: "calc(100% + 6px)", insetInlineEnd: 0, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: 6, minWidth: 168, zIndex: 80, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              role="option"
              aria-selected={lng.code === language}
              onClick={() => { onChange(lng.code); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 9, background: lng.code === language ? T.primarySoft : "transparent", color: lng.code === language ? T.primary : T.ink, border: "none", borderRadius: 9, padding: "9px 10px", fontSize: "calc(13px * var(--wd-text-scale, 1))", fontWeight: lng.code === language ? 700 : 500, cursor: "pointer", textAlign: "start", fontFamily: "inherit" }}
            >
              <span style={{ fontSize: "calc(16px * var(--wd-text-scale, 1))", lineHeight: 1 }}>{lng.flag}</span> {lng.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function SectionTitle({ children, trailing }) {
  const T = useThemeColors();
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 4, minHeight: 32 }}><div className="wd-display" style={{ fontSize: "calc(17px * var(--wd-text-scale, 1))", fontWeight: 600, color: T.ink }}>{children}</div>{trailing}</div>;
}
function StatPill({ icon, label, value, color, bg }) {
  const T = useThemeColors();
  return <div style={{ display: "flex", alignItems: "center", gap: 8, background: bg, color, borderRadius: 12, padding: "9px 13px" }}>{icon}<div><div style={{ fontSize: "calc(10.5px * var(--wd-text-scale, 1))", fontWeight: 600, opacity: 0.85 }}>{label}</div><div style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{value}</div></div></div>;
}
// A small stat/status card echoing the same shape as the "Voortgang vandaag"
// jar cards (round icon badge, bold mono value, muted caption) — used for the
// home screen's quick-glance row so it reads as part of the same system
// instead of a generic colored chip. Pass onClick to make one tappable.
function StatTile({ icon, label, value, color, bg, onClick }) {
  const T = useThemeColors();
  return (
    <button
      onClick={onClick}
      className={onClick ? "wd-btn" : undefined}
      style={{ display: "flex", alignItems: "center", gap: 7, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "7px 9px", flex: "1 1 0", minWidth: 0, cursor: onClick ? "pointer" : "default", fontFamily: "inherit" }}
    >
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0, overflow: "hidden" }}>
        <div className="wd-mono" style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.ink, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{value}</div>
        <div style={{ fontSize: "calc(9px * var(--wd-text-scale, 1))", fontWeight: 600, color: T.muted, letterSpacing: 0.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{label}</div>
      </div>
    </button>
  );
}

// Trendgrafiek therapietrouw: percentage ingenomen doses per week, over de
// laatste weken — los van het maandelijkse printbare rapport hierboven, dat
// per dosis een lijst geeft. Alleen doses met een vast schema tellen mee
// ("indien nodig"-medicatie heeft geen schema om trouw aan af te meten).
function AdherenceTrend({ medications, log, now, periodBounds }) {
  const T = useThemeColors();
  const L = useL();
  const P = usePlural();
  const language = React.useContext(LangContext);
  const todayISO = isoDate(now);
  const periodEnds = useMemo(() => periodEndDateTimes(periodBounds || DEFAULT_PERIOD_BOUNDS, todayISO), [periodBounds, todayISO]);
  const NUM_WEEKS = 8;

  const weeks = useMemo(() => {
    const list = [];
    for (let w = NUM_WEEKS - 1; w >= 0; w--) {
      const weekStart = startOfWeek(new Date(now.getTime() - w * 7 * 86400000));
      let taken = 0, total = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart.getTime() + i * 86400000);
        const dISO = isoDate(d);
        if (dISO > todayISO) continue;
        medications.forEach((med) => {
          if (med.frequency === "indien_nodig") return;
          if (!isDayScheduled(med, d)) return;
          med.times.forEach((t) => {
            const entry = log[logKeyFor(med.id, dISO, t)];
            // Same "hasn't happened yet" rule as the printable report: don't
            // count today's still-open doses as missed before their time.
            if (dISO === todayISO && !entry?.taken) {
              if (isMeal(t)) {
                const end = periodEnds[mealInfo(t.meal).period];
                if (!end || now <= end) return;
              } else if (scheduledDateTime(dISO, t.time) > now) {
                return;
              }
            }
            total++;
            if (entry?.taken) taken++;
          });
        });
      }
      list.push({ weekStart, taken, total, pct: total > 0 ? Math.round((taken / total) * 100) : null });
    }
    return list;
  }, [medications, log, now, todayISO, periodEnds]);

  const weeksWithData = weeks.filter((w) => w.total > 0);
  if (weeksWithData.length === 0) {
    return <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted, textAlign: "center", padding: "10px 0" }}>{L("settings_trend_empty")}</div>;
  }
  const avgPct = Math.round(weeksWithData.reduce((sum, w) => sum + w.pct, 0) / weeksWithData.length);
  const barW = 20, gap = 9, chartH = 84;

  return (
    <div>
      <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 14, lineHeight: 1.4 }}>{L("settings_trend_explain")}</div>
      <div className="wd-scroll" style={{ display: "flex", alignItems: "flex-end", gap, overflowX: "auto", paddingBottom: 6 }}>
        {weeks.map((w, i) => {
          const hasData = w.pct != null;
          const h = hasData ? Math.max(4, Math.round((w.pct / 100) * chartH)) : 4;
          const color = !hasData ? T.border : w.pct >= 80 ? T.success : w.pct >= 50 ? T.gold : T.warn;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0, width: barW + 10 }}>
              <div style={{ fontSize: "calc(10px * var(--wd-text-scale, 1))", fontWeight: 700, color: hasData ? color : T.mutedSoft }}>{hasData ? `${w.pct}%` : "–"}</div>
              <div style={{ width: barW, height: chartH, display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: "100%", height: h, background: color, borderRadius: 4, opacity: hasData ? 1 : 0.35 }} />
              </div>
              <div className="wd-mono" style={{ fontSize: "calc(9px * var(--wd-text-scale, 1))", color: T.mutedSoft, whiteSpace: "nowrap" }}>{w.weekStart.toLocaleDateString(LOCALE_MAP[language], { day: "numeric", month: "short" })}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.ink, marginTop: 12, textAlign: "center" }}>{P("settings_trend_avg", weeksWithData.length, { pct: avgPct })}</div>
    </div>
  );
}

function ReportView({ medications, log, now, periodBounds, onClose }) {
  const T = useThemeColors();
  const L = useL();
  const language = React.useContext(LangContext);
  const todayISO = isoDate(now);
  const currentMonth = todayISO.slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const periodEnds = useMemo(() => periodEndDateTimes(periodBounds || DEFAULT_PERIOD_BOUNDS, todayISO), [periodBounds, todayISO]);

  const rows = useMemo(() => {
    const list = [];
    const [y, m] = month.split("-").map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    const maxDay = month === currentMonth ? now.getDate() : lastDay;
    for (let day = 1; day <= maxDay; day++) {
      const dISO = `${month}-${pad2(day)}`;
      const dDate = new Date(dISO + "T00:00:00");
      medications.forEach((med) => {
        if (med.frequency === "indien_nodig") {
          const prefix = `${med.id}_${dISO}_prn:`;
          Object.keys(log).filter((k) => k.startsWith(prefix) && log[k]?.taken).forEach((k) => {
            const takenDt = new Date(log[k].takenAt);
            list.push({ date: dISO, moment: L("report_prn_moment"), sortKey: takenDt.getHours() * 60 + takenDt.getMinutes(), med: med.name, dose: doseLabel(med, { count: med.prnDoseCount }, L), status: "taken", takenAt: takenDt.toLocaleTimeString(LOCALE_MAP[language], { hour: "2-digit", minute: "2-digit" }) });
          });
          return;
        }
        if (!isDayScheduled(med, dDate)) return;
        med.times.forEach((t) => {
          const key = logKeyFor(med.id, dISO, t);
          const entry = log[key];
          if (isMeal(t)) {
            // Match the same-day "missed" rule used on the main screen: don't
            // list today's not-yet-taken meal dose until its dagdeel is over.
            if (dISO === todayISO && !entry?.taken) {
              const end = periodEnds[mealInfo(t.meal).period];
              if (!end || now <= end) return;
            }
          } else {
            if (scheduledDateTime(dISO, t.time) > now) return;
          }
          list.push({ date: dISO, moment: momentLabel(t, L), sortKey: momentSortValue(t), med: med.name, dose: doseLabel(med, t, L), status: entry?.taken ? "taken" : "missed", takenAt: entry?.takenAt ? new Date(entry.takenAt).toLocaleTimeString(LOCALE_MAP[language], { hour: "2-digit", minute: "2-digit" }) : "" });
        });
      });
    }
    // Newest date first, and within a date, chronological moment order (not
    // alphabetical — mixing "08:00" with "Na het ontbijt" as plain text
    // doesn't sort chronologically).
    return list.sort((a, b) => (a.date !== b.date ? (a.date < b.date ? 1 : -1) : b.sortKey - a.sortKey));
  }, [medications, log, now, todayISO, month, currentMonth, periodEnds]);

  const monthLabel = (() => {
    const [y, m] = month.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString(LOCALE_MAP[language], { month: "long", year: "numeric" });
  })();

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,58,52,0.35)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 12, zIndex: 60, overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 640, margin: "20px 0", fontFamily: "Arial, Helvetica, sans-serif", color: "#111" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontWeight: 700, fontSize: "calc(16.5px * var(--wd-text-scale, 1))"}}>{L("report_title")}</div>
          <button onClick={onClose} className="wd-iconbtn" style={{ background: "none", border: "none", cursor: "pointer", color: "#3F3F3F" }}><X size={20} /></button>
        </div>
        <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <input type="month" value={month} max={currentMonth} onChange={(e) => setMonth(e.target.value)} style={{ border: "1.5px solid #ddd", borderRadius: 10, padding: "10px 12px", fontSize: "calc(15px * var(--wd-text-scale, 1))", color: "#111", minHeight: 44 }} />
          <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, background: T.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 15px", fontWeight: 600, fontSize: "calc(13px * var(--wd-text-scale, 1))", cursor: "pointer" }}><Printer size={14} /> {L("report_print")}</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: "calc(18px * var(--wd-text-scale, 1))"}}>{L("report_header", { month: monthLabel })}</div>
          <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: "#3F3F3F" }}>{L("report_generated", { date: now.toLocaleDateString(LOCALE_MAP[language], { day: "numeric", month: "long", year: "numeric" }) })}</div>
        </div>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", minWidth: 520 }}>
          <thead><tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}><th style={{ padding: "6px 4px" }}>{L("report_col_date")}</th><th style={{ padding: "6px 4px" }}>{L("report_col_moment")}</th><th style={{ padding: "6px 4px" }}>{L("report_col_med")}</th><th style={{ padding: "6px 4px" }}>{L("report_col_dose")}</th><th style={{ padding: "6px 4px" }}>{L("report_col_status")}</th><th style={{ padding: "6px 4px" }}>{L("report_col_taken_at")}</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee", color: r.status === "missed" ? "#B4502C" : "#111" }}><td style={{ padding: "5px 4px" }}>{r.date}</td><td style={{ padding: "5px 4px" }}>{r.moment}</td><td style={{ padding: "5px 4px", fontWeight: 600 }}>{r.med}</td><td style={{ padding: "5px 4px" }}>{r.dose}</td><td style={{ padding: "5px 4px", fontWeight: 600 }}>{L(r.status === "missed" ? "report_status_missed" : "report_status_taken")}</td><td style={{ padding: "5px 4px" }}>{r.takenAt}</td></tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} style={{ padding: "12px 4px", color: "#3F3F3F" }}>{L("report_empty")}</td></tr>}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

// Adds a newly bought batch on top of the stock still left, rather than
// replacing the number outright — so filling in "300" when 200 are left
// results in 500, without having to do that sum yourself or risk resetting
// the countdown that "afvinken" already keeps in sync.
function RestockModal({ med, onClose, onConfirm }) {
  const T = useThemeColors();
  const L = useL();
  const [amount, setAmount] = useState("");
  const current = typeof med.stock === "number" ? med.stock : 0;
  const addNum = Number(amount);
  const valid = amount !== "" && addNum > 0;
  const newTotal = current + (valid ? addNum : 0);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,58,52,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 10, zIndex: 55 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="wd-card" style={{ background: T.surface, borderRadius: 22, padding: 20, width: "100%", maxWidth: 340, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div className="wd-display" style={{ fontSize: "calc(18px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{L("restock_title")}</div>
          <button onClick={onClose} className="wd-iconbtn" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><X size={20} /></button>
        </div>

        <div style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 14 }}>{med.name} — {L("restock_current")} <span style={{ fontWeight: 700, color: T.ink }}>{current} {unitWordFor(med, current, L)}</span></div>

        <Field label={L("restock_field_label", { unit: unitWordFor(med, 2, L) })}>
          <input type="number" inputMode="numeric" min="1" autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={L("restock_placeholder")} style={getInputStyle(T)} />
        </Field>

        <div style={{ fontSize: "calc(13px * var(--wd-text-scale, 1))", fontWeight: 600, color: valid ? T.success : T.mutedSoft, marginBottom: 18, minHeight: 18 }}>
          {valid ? L("restock_new_total", { n: newTotal, unit: unitWordFor(med, newTotal, L) }) : L("restock_prompt")}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="wd-btn" onClick={onClose} style={{ flex: 1, background: T.surfaceSoft, border: `1.5px solid ${T.border}`, color: T.ink, borderRadius: 14, padding: "13px", fontWeight: 600, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: "pointer" }}>{L("common_cancel")}</button>
          <button className="wd-btn" disabled={!valid} onClick={() => valid && onConfirm(addNum)} style={{ flex: 1, background: valid ? T.primary : T.mutedSoft, color: "#fff", border: "none", borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: valid ? "pointer" : "not-allowed" }}>{L("restock_add")}</button>
        </div>
      </div>
    </div>
  );
}

// Switch between the people sharing one MedBox install, or add/rename/
// remove one — the same overlay serves both the quick header switcher and
// the "Profielen" section in Instellingen, so there's only one place that
// needs to know how profiles work.
function ProfileModal({ profiles, activeProfileId, onSwitch, onAdd, onRename, onDelete, onClose }) {
  const T = useThemeColors();
  const L = useL();
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,58,52,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 10, zIndex: 55 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="wd-card" style={{ background: T.surface, borderRadius: 22, padding: 20, width: "100%", maxWidth: 380, maxHeight: "85vh", overflowY: "auto", fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div className="wd-display" style={{ fontSize: "calc(18px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{L("profiles_title")}</div>
          <button onClick={onClose} className="wd-iconbtn" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><X size={20} /></button>
        </div>
        <div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 16, lineHeight: 1.4 }}>{L("profiles_manage_explain")}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {profiles.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: p.id === activeProfileId ? T.primarySoft : T.surfaceSoft, border: `1.5px solid ${p.id === activeProfileId ? T.primary : T.border}`, borderRadius: 14, padding: "10px 12px" }}>
              {renamingId === p.id ? (
                <>
                  <AvatarBadge name={p.name} color={p.color} size={34} />
                  <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} style={{ ...getInputStyle(T), flex: 1, padding: "8px 10px" }} onKeyDown={(e) => { if (e.key === "Enter" && renameValue.trim()) { onRename(p.id, renameValue); setRenamingId(null); } }} />
                  <button className="wd-btn" disabled={!renameValue.trim()} onClick={() => { onRename(p.id, renameValue); setRenamingId(null); }} style={{ background: renameValue.trim() ? T.primary : T.mutedSoft, color: "#fff", border: "none", borderRadius: 10, padding: "8px 12px", fontWeight: 600, fontSize: "calc(12.5px * var(--wd-text-scale, 1))", cursor: renameValue.trim() ? "pointer" : "not-allowed", flexShrink: 0 }}>{L("common_save")}</button>
                </>
              ) : (
                <>
                  <button onClick={() => onSwitch(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", fontFamily: "inherit" }}>
                    <AvatarBadge name={p.name} color={p.color} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      {p.id === activeProfileId && <div style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.primary }}>{L("profiles_active_badge")}</div>}
                    </div>
                  </button>
                  <button className="wd-iconbtn" onClick={() => { setRenamingId(p.id); setRenameValue(p.name); }} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", flexShrink: 0 }}><Pencil size={16} /></button>
                  <button
                    className="wd-iconbtn"
                    onClick={() => {
                      if (profiles.length <= 1) { if (typeof window.alert === "function") window.alert(L("profiles_delete_last_blocked")); return; }
                      if (typeof window.confirm === "function" && !window.confirm(L("profiles_delete_confirm"))) return;
                      onDelete(p.id);
                    }}
                    style={{ background: "none", border: "none", color: profiles.length <= 1 ? T.mutedSoft : T.warn, cursor: profiles.length <= 1 ? "default" : "pointer", flexShrink: 0 }}
                  ><Trash2 size={16} /></button>
                </>
              )}
            </div>
          ))}
        </div>
        {addingNew ? (
          <div style={{ display: "flex", gap: 8 }}>
            <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={L("profiles_name_placeholder")} style={{ ...getInputStyle(T), flex: 1 }} onKeyDown={(e) => { if (e.key === "Enter" && newName.trim()) { onAdd(newName); setAddingNew(false); setNewName(""); } }} />
            <button className="wd-btn" disabled={!newName.trim()} onClick={() => { onAdd(newName); setAddingNew(false); setNewName(""); }} style={{ background: newName.trim() ? T.primary : T.mutedSoft, color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", fontWeight: 700, cursor: newName.trim() ? "pointer" : "not-allowed" }}>{L("common_save")}</button>
          </div>
        ) : (
          <button className="wd-btn" onClick={() => setAddingNew(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: T.primarySoft, color: T.primary, border: `1.5px dashed ${T.primary}66`, borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: "pointer" }}>{L("profiles_add_button")}</button>
        )}
      </div>
    </div>
  );
}

// Full-screen so it reads clearly if you have to hand your phone to someone
// else in a hurry — current medication, allergies and who to call, all in
// one place instead of scattered across Beheer and Instellingen.
function EmergencyCardView({ medications, info, onClose }) {
  const T = useThemeColors();
  const L = useL();
  const hasContact = info.contactName || info.contactPhone || info.doctorName || info.doctorPhone || info.pharmacyName || info.pharmacyPhone;
  return (
    <div className="no-print" style={{ position: "fixed", inset: 0, background: T.bg, zIndex: 65, overflowY: "auto", fontFamily: "'Nunito', sans-serif", color: T.ink }}>
      <div style={{ maxWidth: 480, margin: "0 auto", paddingTop: "max(18px, env(safe-area-inset-top))", paddingLeft: 16, paddingRight: 16, paddingBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={22} color={T.warn} />
            <div className="wd-display" style={{ fontSize: "calc(21px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{L("emergency_title")}</div>
          </div>
          <button onClick={onClose} className="wd-iconbtn" style={{ background: T.surfaceSoft, border: "none", cursor: "pointer", color: T.ink, borderRadius: 10 }}><X size={20} /></button>
        </div>

        {info.allergies && (
          <div style={{ background: T.warnSoft, border: `1.5px solid ${T.warn}55`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
            <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.warn, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{L("field_allergies")}</div>
            <div style={{ fontSize: "calc(15.5px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{info.allergies}</div>
          </div>
        )}

        <SectionTitle>{L("emergency_meds_title")}</SectionTitle>
        {medications.length === 0 ? (
          <div style={{ fontSize: "calc(13px * var(--wd-text-scale, 1))", color: T.muted, marginBottom: 22 }}>{L("emergency_no_meds")}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {medications.map((med) => (
              <div key={med.id} className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: "calc(14.5px * var(--wd-text-scale, 1))"}}>{med.name}{med.dosePerUnit ? ` — ${med.dosePerUnit}` : ""}</div>
                <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.muted }}>
                  {med.frequency === "indien_nodig" ? <>{L("freq_prn")} · {doseLabel(med, { count: med.prnDoseCount }, L)}</> : <>{L("beheer_per_day", { n: med.totalPerDay, unit: unitWordFor(med, med.totalPerDay, L) })} · {med.times.map((t) => momentLabel(t, L)).join(", ")}</>}
                </div>
              </div>
            ))}
          </div>
        )}

        <SectionTitle>{L("emergency_contacts_title")}</SectionTitle>
        {!hasContact ? (
          <div style={{ fontSize: "calc(13px * var(--wd-text-scale, 1))", color: T.muted }}>{L("emergency_no_contacts")}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(info.contactName || info.contactPhone) && <EmergencyContactRow label={L("emergency_contact_label")} name={info.contactName} phone={info.contactPhone} T={T} />}
            {(info.doctorName || info.doctorPhone) && <EmergencyContactRow label={L("emergency_doctor_label")} name={info.doctorName} phone={info.doctorPhone} T={T} />}
            {(info.pharmacyName || info.pharmacyPhone) && <EmergencyContactRow label={L("emergency_pharmacy_label")} name={info.pharmacyName} phone={info.pharmacyPhone} T={T} />}
          </div>
        )}
      </div>
    </div>
  );
}

function EmergencyContactRow({ label, name, phone, T }) {
  return (
    <div className="wd-card" style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
        {name && <div style={{ fontSize: "calc(14.5px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{name}</div>}
        {phone && <div className="wd-mono" style={{ fontSize: "calc(13px * var(--wd-text-scale, 1))", color: T.muted }}>{phone}</div>}
      </div>
      {phone && (
        <a href={`tel:${phone}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: T.primary, color: "#fff", flexShrink: 0 }}><Phone size={18} /></a>
      )}
    </div>
  );
}

// Shown once, the very first time someone opens the app — a quick tap-through
// of the four bottom-nav pages instead of leaving people to figure the
// redesign out themselves.
function OnboardingTour({ onClose }) {
  const T = useThemeColors();
  const L = useL();
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <Home size={26} />, title: L("onboarding_step1_title"), body: L("onboarding_step1_body") },
    { icon: <Calendar size={26} />, title: L("onboarding_step2_title"), body: L("onboarding_step2_body") },
    { icon: <ClipboardList size={26} />, title: L("onboarding_step3_title"), body: L("onboarding_step3_body") },
    { icon: <Settings2 size={26} />, title: L("onboarding_step4_title"), body: L("onboarding_step4_body") },
  ];
  const last = step === steps.length - 1;
  const s = steps[step];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,58,52,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70 }}>
      <div className="wd-card" style={{ background: T.surface, borderRadius: 24, padding: 26, width: "100%", maxWidth: 360, textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.primarySoft, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{s.icon}</div>
        <div className="wd-display" style={{ fontSize: "calc(20px * var(--wd-text-scale, 1))", fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
        <div style={{ fontSize: "calc(13.5px * var(--wd-text-scale, 1))", color: T.muted, lineHeight: 1.5, marginBottom: 20 }}>{s.body}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === step ? T.primary : T.border }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!last && <button className="wd-btn" onClick={onClose} style={{ flex: 1, background: "none", border: "none", color: T.muted, fontWeight: 600, fontSize: "calc(13.5px * var(--wd-text-scale, 1))", cursor: "pointer", padding: "13px" }}>{L("onboarding_skip")}</button>}
          <button className="wd-btn" onClick={() => (last ? onClose() : setStep((v) => v + 1))} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.primary, color: "#fff", border: "none", borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: "calc(14px * var(--wd-text-scale, 1))", cursor: "pointer" }}>{last ? L("onboarding_done") : <>{L("onboarding_next")} <ArrowRight size={15} /></>}</button>
        </div>
      </div>
    </div>
  );
}

function MedModal({ initial, periodBounds, medNameOptions, onClose, onSave }) {
  const T = useThemeColors();
  const L = useL();
  const language = React.useContext(LangContext);
  const [name, setName] = useState(initial?.name || "");
  const [frequency, setFrequency] = useState(initial?.frequency || "dagelijks");
  const [weekdays, setWeekdays] = useState(initial?.weekdays || []);
  const [prnDoseCount, setPrnDoseCount] = useState(initial?.prnDoseCount ?? 1);
  const [unitType, setUnitType] = useState(initial?.unitType === "overig" ? "overig" : "tabletten");
  const [customUnitLabel, setCustomUnitLabel] = useState(initial?.customUnitLabel || "");
  const [totalPerDay, setTotalPerDay] = useState(initial?.totalPerDay ?? "");
  const parsedMg = (() => {
    const m = initial?.dosePerUnit && /^\s*(\d+(?:[.,]\d+)?)\s*mg\s*$/i.test(initial.dosePerUnit) ? initial.dosePerUnit.match(/^\s*(\d+(?:[.,]\d+)?)/) : null;
    return m ? m[1] : null;
  })();
  const [strengthType, setStrengthType] = useState(initial?.strengthType || (parsedMg ? "mg" : (initial?.dosePerUnit ? "overig" : "mg")));
  const [strengthMg, setStrengthMg] = useState(initial?.strengthMg ?? (parsedMg || ""));
  const [strengthOther, setStrengthOther] = useState(initial?.strengthOther ?? (!parsedMg ? (initial?.dosePerUnit || "") : ""));
  const [color, setColor] = useState(initial?.color || MED_COLORS[0]);
  const [times, setTimes] = useState(initial?.times || []);
  const [newMode, setNewMode] = useState("time");
  const [newTime, setNewTime] = useState("");
  const [newMeal, setNewMeal] = useState("ontbijt");
  const [newCount, setNewCount] = useState("");
  const [newNote, setNewNote] = useState("");
  const [stock, setStock] = useState(initial?.stock ?? "");
  const [photo, setPhoto] = useState(initial?.photo || null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [recognizeError, setRecognizeError] = useState("");
  const [recognizedNote, setRecognizedNote] = useState("");

  const distributed = times.reduce((s, t) => s + (t.count || 1), 0);
  const availableMeals = MEALS.filter((m) => !times.some((t) => isMeal(t) && t.meal === m.key));
  const safeNewMeal = availableMeals.some((m) => m.key === newMeal) ? newMeal : (availableMeals[0]?.key || "");

  const addMoment = () => {
    const countNum = Number(newCount);
    if (!newCount || !(countNum > 0)) return;
    if (newMode === "time") {
      if (!newTime || times.some((t) => !isMeal(t) && t.time === newTime)) return;
      setTimes([...times, { id: uid(), mode: "time", time: newTime, count: countNum, note: newNote.trim() }].sort((a, b) => momentSortValue(a) - momentSortValue(b)));
    } else {
      if (!safeNewMeal) return;
      setTimes([...times, { id: uid(), mode: "meal", meal: safeNewMeal, count: countNum, note: newNote.trim() }].sort((a, b) => momentSortValue(a) - momentSortValue(b)));
    }
    setNewTime(""); setNewCount(""); setNewNote("");
  };
  const removeTime = (id) => setTimes(times.filter((t) => t.id !== id));
  const updateTime = (id, field, val) => setTimes(times.map((t) => (t.id === id ? { ...t, [field]: val } : t)));
  const toggleWeekday = (idx) => setWeekdays((prev) => (prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx].sort((a, b) => a - b)));

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoBusy(true);
    setRecognizeError(""); setRecognizedNote("");
    try { setPhoto(await fileToCompressedDataURL(file, 160, 0.82)); } catch (err) { console.error(err); } finally { setPhotoBusy(false); }
  };

  const handleRecognize = async () => {
    setRecognizing(true); setRecognizeError(""); setRecognizedNote("");
    try {
      const sourceDataUrl = photoFile ? await fileToCompressedDataURL(photoFile, 1024, 0.85) : photo;
      if (!sourceDataUrl) throw new Error("Geen foto");
      const result = await recognizeNameFromPhoto(sourceDataUrl);
      if (result.naam) {
        setName(result.naam);
        if (result.dosering && !strengthMg && !strengthOther) {
          const m = /^\s*(\d+(?:[.,]\d+)?)\s*mg\s*$/i.exec(result.dosering);
          if (m) { setStrengthType("mg"); setStrengthMg(m[1]); }
          else { setStrengthType("overig"); setStrengthOther(result.dosering); }
        }
        setRecognizedNote(L("photo_recognized_note"));
      } else setRecognizeError(L("photo_recognize_unclear"));
    } catch (err) { setRecognizeError(L("photo_recognize_failed")); }
    finally { setRecognizing(false); }
  };

  const isPRN = frequency === "indien_nodig";
  const isWeekdays = frequency === "weekdagen";
  const totalValid = isPRN || (totalPerDay !== "" && Number(totalPerDay) > 0);
  const atMax = totalValid && distributed >= Number(totalPerDay);
  const unitValid = unitType !== "overig" || customUnitLabel.trim().length > 0;
  const strengthValid = strengthType === "mg" ? (strengthMg !== "" && Number(strengthMg) > 0) : strengthOther.trim().length > 0;
  const computedDosePerUnit = strengthType === "mg" ? (strengthMg !== "" ? `${strengthMg} mg` : "") : strengthOther.trim();
  const weekdaysValid = !isWeekdays || weekdays.length > 0;
  const timesValid = isPRN || times.length > 0;
  const prnValid = !isPRN || (prnDoseCount !== "" && Number(prnDoseCount) > 0);
  const canSave = name.trim().length > 0 && timesValid && totalValid && unitValid && strengthValid && weekdaysValid && prnValid;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,58,52,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 10, zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="wd-card" style={{ background: T.surface, borderRadius: 22, padding: 20, width: "100%", maxWidth: 400, maxHeight: "92vh", overflowY: "auto", fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="wd-display" style={{ fontSize: "calc(19px * var(--wd-text-scale, 1))", fontWeight: 700 }}>{initial ? L("medmodal_edit_title") : L("medmodal_add_title")}</div>
          <button onClick={onClose} className="wd-iconbtn" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><X size={20} /></button>
        </div>

        <Field label={L("field_name")}>
          <input list="medbox-med-names" value={name} onChange={(e) => { const v = e.target.value; setName(v ? v.charAt(0).toUpperCase() + v.slice(1) : v); }} placeholder={L("field_name_placeholder2")} style={getInputStyle(T)} />
          <datalist id="medbox-med-names">{(medNameOptions || []).map((n) => <option key={n} value={n} />)}</datalist>
        </Field>

        <Field label={L("field_frequency")}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: frequency === "weekdagen" ? 10 : 0 }}>
            <button type="button" onClick={() => setFrequency("dagelijks")} style={getToggleBtnStyle(T, frequency === "dagelijks")}>{L("freq_daily")}</button>
            <button type="button" onClick={() => setFrequency("weekdagen")} style={getToggleBtnStyle(T, frequency === "weekdagen")}>{L("freq_fixed_days")}</button>
            <button type="button" onClick={() => setFrequency("indien_nodig")} style={getToggleBtnStyle(T, frequency === "indien_nodig")}>{L("freq_prn")}</button>
          </div>
          {frequency === "weekdagen" && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {DAY_SHORT_BY_LANG[language].map((d, i) => (
                <button key={i} type="button" onClick={() => toggleWeekday(i)} style={{ width: 42, height: 42, borderRadius: 10, background: weekdays.includes(i) ? T.primary : T.surfaceSoft, color: weekdays.includes(i) ? "#fff" : T.muted, border: `1.5px solid ${weekdays.includes(i) ? T.primary : T.border}`, fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 700, cursor: "pointer" }}>{d}</button>
              ))}
            </div>
          )}
          {frequency === "weekdagen" && weekdays.length === 0 && <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", marginTop: 6, fontWeight: 600, color: T.warn }}>{L("weekdays_choose_one")}</div>}
          {frequency === "indien_nodig" && <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", color: T.mutedSoft, marginTop: 8, lineHeight: 1.4 }}>{L("prn_explain")}</div>}
        </Field>

        <Field label={L("field_photo")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <AvatarBadge name={name} color={color} photo={photo} size={46} />
            <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", color: T.mutedSoft, flex: 1 }}>{L("photo_auto_explain")}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <label style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, color: T.primary, cursor: "pointer", background: T.primarySoft, borderRadius: 10, padding: "10px 14px" }}>
              {photoBusy ? L("photo_busy") : photo ? L("photo_change") : L("photo_add")}
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            </label>
            {photo && <button className="wd-iconbtn" onClick={() => { setPhoto(null); setPhotoFile(null); }} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }}><X size={18} /></button>}
          </div>
          {photo && (
            <button type="button" className="wd-btn" onClick={handleRecognize} disabled={recognizing} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, background: T.surfaceSoft, border: `1.5px solid ${T.border}`, color: T.primary, borderRadius: 10, padding: "10px 14px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: recognizing ? "default" : "pointer" }}>
              <ScanLine size={15} /> {recognizing ? L("photo_recognize_busy") : L("photo_recognize")}
            </button>
          )}
          {recognizedNote && <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", color: T.success, marginTop: 6 }}>{recognizedNote}</div>}
          {recognizeError && <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", color: T.warn, marginTop: 6 }}>{recognizeError}</div>}
        </Field>

        <Field label={L("field_color")}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{MED_COLORS.map((c) => <button key={c} onClick={() => setColor(c)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: color === c ? `3px solid ${T.ink}` : "3px solid transparent", cursor: "pointer" }} />)}</div>
        </Field>

        <Field label={L("field_shape")}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: unitType === "overig" ? 8 : 0 }}>
            <button type="button" onClick={() => setUnitType("tabletten")} style={{ ...getToggleBtnStyle(T, unitType === "tabletten"), flex: "1 1 40%" }}>{L("shape_tablets")}</button>
            <button type="button" onClick={() => setUnitType("zalf")} style={{ ...getToggleBtnStyle(T, unitType === "zalf"), flex: "1 1 40%" }}>{L("shape_ointment")}</button>
            <button type="button" onClick={() => setUnitType("druppels")} style={{ ...getToggleBtnStyle(T, unitType === "druppels"), flex: "1 1 40%" }}>{L("shape_drops")}</button>
            <button type="button" onClick={() => setUnitType("overig")} style={{ ...getToggleBtnStyle(T, unitType === "overig"), flex: "1 1 40%" }}>{L("shape_other")}</button>
          </div>
          {unitType === "overig" && <input value={customUnitLabel} onChange={(e) => setCustomUnitLabel(e.target.value)} placeholder={L("shape_other_placeholder")} style={getInputStyle(T)} />}
        </Field>

        {!isPRN && (
        <Field label={L("field_daily_dose")}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <input type="number" inputMode="numeric" min="1" value={totalPerDay} onChange={(e) => setTotalPerDay(e.target.value)} placeholder={L("daily_dose_placeholder")} style={{ ...getInputStyle(T), flex: 1, minWidth: 120 }} />
          </div>
          {!totalValid && <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", marginTop: 6, fontWeight: 600, color: T.warn }}>{L("daily_dose_missing", { unit: unitWordFor({ unitType, customUnitLabel }, 2, L) })}</div>}
          {totalValid && <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", marginTop: 6, fontWeight: 600, color: distributed === Number(totalPerDay) ? T.success : T.warn }}>{L("daily_dose_distributed", { a: distributed, b: totalPerDay, unit: unitWordFor({ unitType, customUnitLabel }, Number(totalPerDay), L) })}</div>}
        </Field>
        )}

        <Field label={L("field_strength", { unit: unitWordFor({ unitType, customUnitLabel }, 1, L) })}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button type="button" onClick={() => setStrengthType("mg")} style={getToggleBtnStyle(T, strengthType === "mg")}>mg</button>
            <button type="button" onClick={() => setStrengthType("overig")} style={getToggleBtnStyle(T, strengthType === "overig")}>{L("shape_other")}</button>
          </div>
          {strengthType === "mg" ? (
            <div style={{ position: "relative" }}>
              <input type="number" inputMode="decimal" min="0" step="any" value={strengthMg} onChange={(e) => setStrengthMg(e.target.value)} placeholder={L("strength_mg_placeholder")} style={{ ...getInputStyle(T), paddingRight: 44 }} />
              <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", fontSize: "calc(13.5px * var(--wd-text-scale, 1))", color: T.mutedSoft, fontWeight: 600, pointerEvents: "none" }}>mg</span>
            </div>
          ) : (
            <input value={strengthOther} onChange={(e) => setStrengthOther(e.target.value)} placeholder={L("strength_other_placeholder")} style={getInputStyle(T)} />
          )}
          {!strengthValid && <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", marginTop: 6, fontWeight: 600, color: T.warn }}>{L("strength_missing")}</div>}
        </Field>

        {!isPRN && (
        <Field label={L("field_moments")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
            {times.filter((t) => (newMode === "meal" ? isMeal(t) : !isMeal(t))).map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {isMeal(t) ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: T.goldSoft, color: "#8A6420", borderRadius: 9, padding: "8px 9px", fontSize: "calc(11.5px * var(--wd-text-scale, 1))", fontWeight: 700, minWidth: 92 }}><Utensils size={12} /> {L(MEAL_KEY_MAP[t.meal] || t.meal)}</div>
                ) : (
                  <div className="wd-mono" style={{ background: T.primarySoft, color: T.primary, borderRadius: 9, padding: "8px 9px", fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 700, minWidth: 56, textAlign: "center" }}>{t.time}</div>
                )}
                <div className="wd-mono" style={{ fontSize: "calc(9.5px * var(--wd-text-scale, 1))", color: T.mutedSoft, minWidth: 42 }}>{L(PERIOD_KEY_MAP[momentPeriod(t, periodBounds)] || momentPeriod(t, periodBounds))}</div>
                <input type="number" inputMode="numeric" min="1" value={t.count} onChange={(e) => updateTime(t.id, "count", Math.max(1, Number(e.target.value) || 1))} title={L("field_count_short")} style={{ ...getInputStyle(T), width: 60, padding: "8px 4px", textAlign: "center", fontSize: "calc(13px * var(--wd-text-scale, 1))"}} />
                <input value={t.note} onChange={(e) => updateTime(t.id, "note", e.target.value)} placeholder={L("moments_note_placeholder")} style={{ ...getInputStyle(T), flex: 1, minWidth: 100, padding: "8px 10px", fontSize: "calc(13px * var(--wd-text-scale, 1))"}} />
                <button className="wd-iconbtn" onClick={() => removeTime(t.id)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }}><X size={16} /></button>
              </div>
            ))}
            {(() => {
              const hiddenCount = times.filter((t) => (newMode === "meal" ? !isMeal(t) : isMeal(t))).length;
              if (hiddenCount === 0) return null;
              const labelKey = newMode === "meal" ? (hiddenCount === 1 ? "moments_hidden_time_one" : "moments_hidden_time_other") : (hiddenCount === 1 ? "moments_hidden_meal_one" : "moments_hidden_meal_other");
              return (
                <button type="button" onClick={() => setNewMode(newMode === "meal" ? "time" : "meal")} style={{ background: "none", border: "none", color: T.mutedSoft, fontSize: "calc(11.5px * var(--wd-text-scale, 1))", textAlign: "left", cursor: "pointer", padding: "6px 0" }}>
                  {L("moments_hidden_prefix", { n: hiddenCount, label: L(labelKey), tabLabel: newMode === "meal" ? L("moment_fixed_time") : L("moment_after_meal") })}
                </button>
              );
            })()}
          </div>

          {atMax ? (
            <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: "#8A6420", background: T.goldSoft, borderRadius: 10, padding: "10px 12px", lineHeight: 1.4 }}>
              {L("moments_at_max", { n: totalPerDay, unit: unitWordFor({ unitType, customUnitLabel }, Number(totalPerDay), L) })}
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <button type="button" onClick={() => setNewMode("time")} style={getToggleBtnStyle(T, newMode === "time")}>{L("moment_fixed_time")}</button>
                <button type="button" onClick={() => setNewMode("meal")} style={getToggleBtnStyle(T, newMode === "meal")}>{L("moment_after_meal")}</button>
              </div>

              {newMode === "meal" && availableMeals.length === 0 ? (
                <div style={{ fontSize: "calc(12px * var(--wd-text-scale, 1))", color: T.mutedSoft, background: T.surfaceSoft, borderRadius: 10, padding: "10px 12px" }}>{L("moments_all_meals_set")}</div>
              ) : (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {newMode === "time" ? (
                    <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ ...getInputStyle(T), flex: 1, minWidth: 100 }} />
                  ) : (
                    <select value={safeNewMeal} onChange={(e) => setNewMeal(e.target.value)} style={{ ...getInputStyle(T), flex: 1, minWidth: 100 }}>
                      {availableMeals.map((m) => <option key={m.key} value={m.key}>{L(MEAL_KEY_MAP[m.key] || m.key)}</option>)}
                    </select>
                  )}
                  <input type="number" inputMode="numeric" min="1" value={newCount} onChange={(e) => setNewCount(e.target.value)} placeholder={L("field_count_short")} title={L("field_count_short")} style={{ ...getInputStyle(T), width: 68, textAlign: "center" }} />
                  <button onClick={addMoment} disabled={!newCount || !(Number(newCount) > 0)} style={{ background: (!newCount || !(Number(newCount) > 0)) ? T.mutedSoft : T.primary, color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", fontWeight: 700, fontSize: "calc(16px * var(--wd-text-scale, 1))", cursor: (!newCount || !(Number(newCount) > 0)) ? "not-allowed" : "pointer", minHeight: 44 }}>+</button>
                </div>
              )}
              {newMode === "meal" && availableMeals.length > 0 && <div style={{ fontSize: "calc(11px * var(--wd-text-scale, 1))", color: T.mutedSoft, marginTop: 6, lineHeight: 1.4 }}>{L("moments_meal_hint")}</div>}
            </>
          )}
        </Field>
        )}

        {isPRN && (
        <Field label={L("field_prn_amount")}>
          <input type="number" inputMode="numeric" min="1" value={prnDoseCount} onChange={(e) => setPrnDoseCount(e.target.value)} placeholder={L("prn_amount_placeholder")} style={getInputStyle(T)} />
        </Field>
        )}

        <Field label={L("field_stock")}>
          <input type="number" inputMode="numeric" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder={L("stock_placeholder")} style={getInputStyle(T)} />
          <div style={{ fontSize: "calc(11.5px * var(--wd-text-scale, 1))", color: T.mutedSoft, marginTop: 6, lineHeight: 1.4 }}>{isPRN ? L("stock_prn_note") : L("stock_auto_warn", { n: (totalValid ? Number(totalPerDay) : distributed) * REFILL_LEAD_DAYS, unit: unitWordFor({ unitType, customUnitLabel }, 2, L), days: REFILL_LEAD_DAYS, perday: totalValid ? totalPerDay : distributed })}</div>
        </Field>

        <button
          disabled={!canSave}
          onClick={() => onSave({ id: initial?.id || uid(), createdAt: initial?.createdAt || new Date().toISOString(), name: name.trim(), frequency, weekdays: isWeekdays ? weekdays : [], prnDoseCount: Math.max(1, Number(prnDoseCount) || 1), unitType, customUnitLabel: customUnitLabel.trim(), totalPerDay: isPRN ? null : Number(totalPerDay), strengthType, strengthMg, strengthOther: strengthOther.trim(), dosePerUnit: computedDosePerUnit, color, times: isPRN ? [] : times, photo, leaflet: initial?.leaflet, stock: stock === "" ? null : Number(stock) })}
          style={{ width: "100%", marginTop: 8, background: canSave ? T.primary : T.mutedSoft, color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontWeight: 700, fontSize: "calc(15px * var(--wd-text-scale, 1))", cursor: canSave ? "pointer" : "not-allowed" }}
        >
          {initial ? L("medmodal_save_edit") : L("medmodal_save_add")}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  const T = useThemeColors();
  return <div style={{ marginBottom: 16, ...style }}><div style={{ fontSize: "calc(12.5px * var(--wd-text-scale, 1))", fontWeight: 600, color: T.muted, marginBottom: 7 }}>{label}</div>{children}</div>;
}

function getToggleBtnStyle(T, active) {
  return { flex: 1, background: active ? T.primary : T.surfaceSoft, color: active ? "#fff" : T.muted, border: `1.5px solid ${active ? T.primary : T.border}`, borderRadius: 10, padding: "11px 0", fontSize: "calc(13px * var(--wd-text-scale, 1))", fontWeight: 600, cursor: "pointer", minHeight: 44 };
}

function getInputStyle(T) {
  return { width: "100%", boxSizing: "border-box", border: `1.5px solid ${T.border}`, borderRadius: 11, padding: "12px 13px", fontSize: "calc(16px * var(--wd-text-scale, 1))", color: T.ink, outline: "none", background: T.surfaceSoft, minHeight: 44 };
}