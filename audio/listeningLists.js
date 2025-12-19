const listeningLists = [
    {
        title: 'QUYỂN 1',
        tracks: [
            {
                title: 'Bài 1: 01-01',
                src: 'audio/mp3/01-01.mp3',
                text: [
                    // { speaker: '', content: '' },
                    { speaker: '明華', content: '請問你是陳月美小烜嗎 ？' },
                    { speaker: '月美', content: '是的 。謝謝你來接我們 。' },
                    { speaker: '明華', content: '不客氣 。我是李明華 。' },
                    { speaker: '月美', content: '這是王先生 。' },
                    { speaker: '開文', content: '你好。我姓王，叫開文 。' },
                    { speaker: '明華', content: '你們好 。歡迎你們來臺灣 。' },
                ]
            },
            {
                title: 'Bài 1: 01-03',
                src: 'audio/mp3/01-03.mp3',
                text: [
                    { speaker: '明華', content: '請喝茶。' },
                    { speaker: '開文', content: '謝謝。很好喝。請問這是什麼茶？' },
                    { speaker: '明華', content: '這是烏龍茶。臺灣人喜歡喝茶。' },
                    { speaker: '明華', content: '開文，你們日本人呢？' },
                    { speaker: '月美', content: '他不是日本人。' },
                    { speaker: '明華', content: '對不起，你是哪國人？' },
                    { speaker: '開文', content: '我是美國人。' },
                    { speaker: '明華', content: '開文，你要不要喝咖啡？' },
                    { speaker: '開文', content: '謝謝！我不喝咖啡，我喜歡喝茶。' },
                ]
            },
            {
                title: 'Bài 2: 02-01',
                src: 'audio/mp3/02-01.mp3',
                text: [
                    { speaker: '怡君', content: '這是我家。請進！' },
                    { speaker: '安同', content: '很漂亮的房子！' },
                    { speaker: '怡君', content: '請坐！要不要喝茶？' },
                    { speaker: '安同', content: '好，謝謝你。你家有很多照片。' },
                    { speaker: '怡君', content: '我家人都很喜歡照相。' },
                    { speaker: '安同', content: '這張照片很好看。這是誰？你姐姐嗎？' },
                    { speaker: '怡君', content: '不是，是我妹妹。這是我爸爸、媽媽。' },
                    { speaker: '安同', content: '你家人都很好看。' },
                ]
            },
            {
                title: 'Bài 2: 02-03',
                src: 'audio/mp3/02-03.mp3',
                text: [
                    { speaker: '明華', content: '田中，歡迎！歡迎！請進。' },
                    { speaker: '田中', content: '謝謝。' },
                    { speaker: '明華', content: '田中，這是我媽媽。' },
                    { speaker: '田中', content: '伯母，您好。' },
                    { speaker: '明華的媽媽', content: '你好，你好。來！來！來！請坐。你叫什麼名字？' },
                    { speaker: '田中', content: '我叫誠一。你們家有很多書。' },
                    { speaker: '明華', content: '都是我哥哥的書。他是老師，他很喜歡看書。' },
                    { speaker: '明華的媽媽', content: '誠一，你家有幾個人？你有沒有兄弟姐妹？' },
                    { speaker: '田中', content: '我家有五個人，我有兩個妹妹。' },
                ]
            },
            {
                title: 'Bài 3: 03-01',
                src: 'audio/mp3/03-01.mp3',
                text: [
                    { speaker: '安同', content: '田中，你喜歡聽音樂嗎？' },
                    { speaker: '田中', content: '我不喜歡聽音樂。我喜歡運動。' },
                    { speaker: '安同', content: '你喜歡打網球嗎？' },
                    { speaker: '田中', content: '我不喜歡打網球。' },
                    { speaker: '安同', content: '你喜歡做什麼？' },
                    { speaker: '田中', content: '打棒球和游泳，你呢？' },
                    { speaker: '安同', content: '我常打籃球，也常踢足球。' },
                    { speaker: '田中', content: '我覺得踢足球很好玩。' },
                    { speaker: '安同', content: '明天是週末，我們早上去踢足球，怎麼樣？' },
                    { speaker: '田中', content: '好啊！' },
                ]
            },
            {
                title: 'Bài 3: 03-03',
                src: 'audio/mp3/03-03.mp3',
                text: [
                    { speaker: '如玉', content: '今天晚上我們去看電影，好不好？' },
                    { speaker: '月美', content: '好啊！' },
                    { speaker: '如玉', content: '妳想看美國電影還是臺灣電影？' },
                    { speaker: '月美', content: '美國電影、臺灣電影，我都想看。' },
                    { speaker: '如玉', content: '我們看臺灣電影吧！' },
                    { speaker: '月美', content: '好啊！看電影可以學中文。' },
                    { speaker: '如玉', content: '晚上要不要一起吃晚飯？' },
                    { speaker: '月美', content: '好，我們去吃越南菜。' },
                ]
            },
            {
                title: 'Bài 4: 04-01',
                src: 'audio/mp3/04-01.mp3',
                text: [
                    { speaker: '老闆', content: '請問你要買什麼？' },
                    { speaker: '明華', content: '一杯熱咖啡。兩個包子。' },
                    { speaker: '老闆', content: '你要大杯、中杯還是小杯？' },
                    { speaker: '明華', content: '大杯。包子請幫我微波。' },
                    { speaker: '老闆', content: '好的。請問外帶還是內用？' },
                    { speaker: '明華', content: '外帶，一共多少錢？' },
                    { speaker: '老闆', content: '咖啡八十，包子四十，一共一百二十塊。' },
                ]
            },
            {
                title: 'Bài 4: 04-03',
                src: 'audio/mp3/04-03.mp3',
                text: [
                    { speaker: '月美', content: '我想買一支新手機。' },
                    { speaker: '明華', content: '妳的手機很好。為什麼要買新的？' },
                    { speaker: '月美', content: '我這支手機太舊了，不好看。' },
                    { speaker: '明華', content: '妳想買哪種手機？' },
                    { speaker: '月美', content: '能照相也能上網。' },
                    { speaker: '明華', content: '那種手機很好，我哥哥有一支。' },
                    { speaker: '月美', content: '貴不貴？一支賣多少錢？' },
                    { speaker: '明華', content: '那種手機不便宜。一支要一萬五千多。' },
                ]
            },
            {
                title: 'Bài 5: 05-01',
                src: 'audio/mp3/05-01.mp3',
                text: [
                    { speaker: '月美', content: '很多人都說臺灣有不少有名的小吃。' },
                    { speaker: '明華', content: '是啊！牛肉麵、小籠包、臭豆腐...都很好吃。' },
                    { speaker: '月美', content: '你最喜歡吃什麼？' },
                    { speaker: '明華', content: '牛肉麵。牛肉好吃，湯也很好喝。' },
                    { speaker: '月美', content: '這麼好吃，我很想吃。' },
                    { speaker: '明華', content: '我知道一家有名的牛肉麵店，我們一起去吃，怎麼樣？' },
                    { speaker: '月美', content: '太好了！' },
                    { speaker: '明華', content: '我們明天去。一定要點大碗的。' },
                ]
            },
            {
                title: 'Bài 5: 05-03',
                src: 'audio/mp3/05-03.mp3',
                text: [
                    { speaker: '月美', content: '昨天晚上那家餐廳的菜很好吃，可是有一點辣。' },
                    { speaker: '安同', content: '我也怕辣，所以我喜歡自己做飯。' },
                    { speaker: '月美', content: '你做飯做得怎麼樣？' },
                    { speaker: '安同', content: '我做得不好。妳會做飯嗎？' },
                    { speaker: '月美', content: '會。我的甜點也做得不錯。' },
                    { speaker: '安同', content: '我最喜歡吃甜點。妳可以教我嗎？' },
                    { speaker: '月美', content: '好的，這個週末，你到我家來。' },
                    { speaker: '安同', content: '好啊！謝謝妳。' },
                ]
            },
            {
                title: 'Bài 6: 06-01',
                src: 'audio/mp3/06-01.mp3',
                text: [
                    { speaker: '安同', content: '聽說怡君的學校很漂亮。' },
                    { speaker: '如玉', content: '他們學校在哪裡？遠不遠？' },
                    { speaker: '安同', content: '有一點遠。他們學校在花蓮的山上。' },
                    { speaker: '如玉', content: '山上？那裡的風景一定很美。' },
                    { speaker: '安同', content: '是的，他們學校前面有海，後面有山，那裡真是一個很漂亮的地方。' },
                    { speaker: '如玉', content: '我想去看看。我們這個週末一起去吧！' },
                    { speaker: '安同', content: '好啊！我現在要去學校附近的咖啡店買咖啡。妳呢？' },
                    { speaker: '如玉', content: '我去樓下找朋友，我們要一起去上課。' },
                ]
            },
            {
                title: 'Bài 6: 06-03',
                src: 'audio/mp3/06-03.mp3',
                text: [
                    { speaker: '怡君', content: '歡迎你們來。' },
                    { speaker: '安同', content: '你們學校真遠！' },
                    { speaker: '怡君', content: '是啊，不是很近，有一點不方便。' },
                    { speaker: '如玉', content: '這裡的學生在哪裡買東西？' },
                    { speaker: '怡君', content: '在學校外面。學校裡面沒有商店。' },
                    { speaker: '安同', content: '吃飯呢？學校裡面有沒有餐廳？' },
                    { speaker: '怡君', content: '有，餐廳在學生宿舍的一樓。' },
                    { speaker: '安同', content: '前面這棟大樓很漂亮。' },
                    { speaker: '怡君', content: '這是圖書館，旁邊的那棟大樓是教室，圖書館後面有游泳池。' },
                ]
            },
            
            // {
            //     title: 'Bài 1: 01-01',
            //     src: 'audio/mp3/01-01.mp3',
            //     text: [
            //         // { speaker: '', content: '' },
            //     ]
            // },
            // {
            //     title: 'Bài 1: 01-03',
            //     src: 'audio/mp3/01-03.mp3',
            //     text: [
            //         // { speaker: '', content: '' },
            //     ]
            // },
        ]
    },
    {
        title: 'Quyển 2',
        tracks: [
            {
                title: 'Bài 1: Hỏi giá',
                src: 'audio/mp3/',
                text: [
                    { speaker: 'A', content: '這個多少錢？' },
                    { speaker: 'B', content: '一百塊。' }
                ]
            }
        ]
    },
];