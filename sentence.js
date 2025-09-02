/*******************************
 * 1) DỮ LIỆU TỪ VỰNG (ví dụ)
 * Thay/ví dụ bằng 1000 từ của bạn.
 *******************************/
const sentence = [
    //    { chinese: "", mean: "", pronunciation: "", pinyin: "" },
    { chinese: "不客氣", mean: "đừng khách sáo", pronunciation: "bủ khưa chì", pinyin: "bùkèqi" },
    { chinese: "哪國", mean: "Nước nào ?", pronunciation: "nả gủa", pinyin: "Nǎ guó" },
    { chinese: "對不起", mean: "xin lỗi", pronunciation: "tuy bu chỉ", pinyin: "duìbuqǐ" },
    { chinese: "烏龍茶", mean: "trà ô long", pronunciation: "u lóng chả", pinyin: "wūlóngchá" },
    { chinese: "請喝茶", mean: "Xin mời dùng trà", pronunciation: "", pinyin: "Qǐng hē chá" },
    { chinese: "謝謝。很好喝。請問這是什麼茶？", mean: "Cảm ơn. Rất ngon. Xin hỏi đây là trà gì? 🍵", pronunciation: "", pinyin: "Xièxiè. Hěn hǎo hē. Qǐngwèn zhè shì shénme chá?" },
    { chinese: "這 是 烏 龍 茶。臺 灣 人 喜歡 喝 茶。", mean: "Đây là trà Ô Long. Người Đài Loan thích uống trà. 🍵", pronunciation: "", pinyin: " Zhè shì wūlóngchá. Táiwān rén xǐhuān hē chá." },
    { chinese: "開文，你們日本人呢？", mean: "Khai Văn, còn các bạn người Nhật thì sao?", pronunciation: "", pinyin: "Kāi wén, nǐ men Rì běn rén ne?" },
    { chinese: "他不是日本人。", mean: "Anh ấy/Ông ấy/Người đó không phải là người Nhật.", pronunciation: "", pinyin: "Tā bú shì Rìběn rén." },
    { chinese: "對不起，你是哪國人？", mean: "Xin lỗi, bạn là người nước nào?", pronunciation: "", pinyin: "Duìbuqǐ, nǐ shì nǎ guó rén?" },
    { chinese: "我是美國人。", mean: "Tôi là người Mỹ.", pronunciation: "", pinyin: "Wǒ shì Měiguó rén." },
    { chinese: "開文，你要不要喝咖啡？", mean: "Khai Văn, bạn có muốn uống cà phê không?", pronunciation: "", pinyin: "Kāi Wén, nǐ yào bù yào hē kāfēi?" },
    { chinese: "謝謝！我不喝咖啡，我喜歡喝茶。", mean: "Cảm ơn! Tôi không uống cà phê, tôi thích uống trà.", pronunciation: "", pinyin: "Xièxie! Wǒ bù hē kāfēi, wǒ xǐhuān hē chá." },
    { chinese: "王先生要不要喝咖啡？", mean: "Ông Vương có muốn uống cà phê không?", pronunciation: "", pinyin: "Wáng xiānsheng yào bù yào hē kāfēi?" },
    { chinese: "這是不是烏龍茶？", mean: "Đây có phải là trà Ô Long không?", pronunciation: "", pinyin: "Zhè shì bú shì Wūlóng chá?" },
    { chinese: "臺灣人喜歡不喜歡喝茶？", mean: "Người Đài Loan có thích uống trà hay không?", pronunciation: "", pinyin: "Táiwān rén xǐhuān bù xǐhuān hē chá?" },
    { chinese: "你好嗎？", mean: "Bạn có khỏe không?", pronunciation: "", pinyin: "Nǐ hǎo ma?" },
    { chinese: "你來接我們嗎？", mean: "Bạn đến đón chúng tôi à?", pronunciation: "", pinyin: "Nǐ lái jiē wǒmen ma?" },
    { chinese: "他是日本人嗎？", mean: "Anh ấy là người Nhật phải không?", pronunciation: "", pinyin: "Tā shì Rìběn rén ma?" },
];