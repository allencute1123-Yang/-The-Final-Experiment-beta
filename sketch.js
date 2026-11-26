// 像素風火車魔王戰 - p5.js (全域模式, 直接貼進 sketch.js)
// 世界座標 192x108, 放大 S 倍顯示; 文字走真實解析度, 中文才清楚。
const W = 192, H = 108, GY = 54; // GY = 車頂高度
let S = 4, SX = 1, SY = 1, ox = 0, oy = 0;         // S = 世界放大倍率(整數), ox/oy = 置中偏移 (由 layout() 自動計算)
const SP = [1, 1.3, 1.6, 2, 2.4];       // 五個小遊戲的速度倍率
const NM = ['攻擊', '防禦', '能量', '血量', '金幣'], GL = ['↑', '↓', '←', '→'];
const WH = [-1, 9, 53, 63, 87, 97, 141, 151, 172, 181];
const P1 = { b: '#9b3a2c', s: '#7a2b21', h: '#c15a45', d: '#4a1a16', o: '#a84634' };
const P2 = { b: '#2f5d7c', s: '#244a63', h: '#4f86a6', d: '#142c3b', o: '#386b8c' };
let st = 'title', t = 0, sh = 0, hst = 0, endT = 0, bannerT = 0, sky, bal, fgG;
let trG = [], P, B, parts = [], proj = [], pops = [], sm = [], mi = 0, M = null;
let Bl = [], evs = [], evi = 0, qOk = true, BN = '自由戰鬥！';
let En = [], MYS = false, FD = 0, nbT = 0, RLt = 0, RLmsg = '', STARS = [], eyeG, irisG;
let AC = null, MG = null, MC = '', stp = 0, nxt = 0, MUTE = false, NBUF = null;
let TT = 0, TS = 'gate', TSel = 0; // 標題: 計時 / 狀態(gate,open,menu,intro) / 選項
// 節點順序: A=屬性(先答題再小遊戲), E=事件抉擇。想增減節點改這裡即可
const NODES = [{ t: 'A', i: 0 }, { t: 'A', i: 1 }, { t: 'E' }, { t: 'B', h: 0 }, { t: 'A', i: 2 }, { t: 'A', i: 3 }, { t: 'E' }, { t: 'B', h: 1 }, { t: 'A', i: 4 }, { t: 'S' }]; // 最後一站為商店，購買完畢後進入魔王戰
const SUBJ = ['國文', '英文', '數學', '自然', '社會'], PN = ['簡單', '普通', '困難', '超級難', '終結技'];
const BD = [9, 12, 16, 21, 29];  // 五套彈幕每顆傷害
const BC = [['#ff7ad9', '#ffd1f5'], ['#b07aff', '#e6d4ff'], ['#ff6a6a', '#ffd0d0'], ['#ff9a3d', '#ffe2b8'], ['#ffffff', '#a24bff']];
// 題庫: [題目, 正解, 錯誤1, 錯誤2, 錯誤3] (國英數自社各一組, 之後直接換成你的題目)
const QB = [
  [['「春眠不覺曉」的下一句？', '處處聞啼鳥', '夜來風雨聲', '花落知多少', '欲窮千里目'], ['〈岳陽樓記〉的作者是？', '范仲淹', '蘇軾', '杜甫', '韓愈'], ['成語「畫蛇添足」的意思？', '多此一舉', '精益求精', '功虧一簣', '一氣呵成'], ['被稱為「詩仙」的是？', '李白', '杜甫', '白居易', '王維'],
   ['「三顧茅廬」指劉備拜訪誰？', '諸葛亮', '關羽', '張飛', '曹操'], ['成語「亡羊補牢」的意思？', '出錯後設法補救', '損失慘重', '小心謹慎', '羊群走失'], ['「但願人長久」的下一句？', '千里共嬋娟', '低頭思故鄉', '一覽眾山小', '大江東去'], ['下列何者是四大名著之一？', '紅樓夢', '聊齋志異', '儒林外史', '老殘遊記'],
   ['「欲窮千里目」的下一句？', '更上一層樓', '黃河入海流', '白日依山盡', '春風又綠江南岸'], ['成語「井底之蛙」比喻？', '見識狹隘', '勤奮好學', '聰明機智', '勇敢無畏'], ['被稱為「詩聖」的是？', '杜甫', '李白', '王維', '李商隱'], ['「己所不欲」的下一句？', '勿施於人', '以德報怨', '不亦樂乎', '必有我師']],
  [['Which word means "happy"?', 'glad', 'angry', 'tired', 'hungry'], ['She ___ to school every day.', 'goes', 'go', 'going', 'gone'], ['Past tense of "buy" is?', 'bought', 'buyed', 'buys', 'buying'], ['Opposite of "difficult"?', 'easy', 'hard', 'heavy', 'high'],
   ['Which one is a fruit?', 'apple', 'carrot', 'bread', 'milk'], ['There ___ three cats.', 'are', 'is', 'am', 'be'], ['He is taller ___ me.', 'than', 'then', 'that', 'as'], ['Yesterday I ___ a movie.', 'watched', 'watch', 'watching', 'watches'],
   ['Opposite of "hot"?', 'cold', 'warm', 'spicy', 'wet'], ['Plural of "child" is?', 'children', 'childs', 'childes', 'childrens'], ['Which one is a color?', 'purple', 'pencil', 'piano', 'pillow'], ['I ___ breakfast every morning.', 'eat', 'eats', 'eating', 'ate']],
  [['12 × 8 = ?', '96', '86', '106', '88'], ['3x + 5 = 20，x = ?', '5', '4', '6', '15'], ['邊長 7 的正方形，周長是？', '28', '14', '49', '21'], ['200 的 15% 是？', '30', '15', '20', '45'],
   ['144 ÷ 12 = ?', '12', '14', '11', '13'], ['7² − 3² = ?', '40', '16', '10', '58'], ['三角形內角和是？', '180°', '90°', '360°', '270°'], ['0.5 + 0.25 = ?', '0.75', '0.7', '0.55', '1.25'],
   ['長 8 寬 5 的長方形面積？', '40', '13', '26', '45'], ['2x = 18，x = ?', '9', '8', '16', '36'], ['5 × 5 × 5 = ?', '125', '25', '75', '100'], ['1/2 + 1/4 = ?', '3/4', '2/6', '1/6', '2/4']],
  [['水的化學式是？', 'H2O', 'CO2', 'O2', 'NaCl'], ['光合作用吸收哪種氣體？', '二氧化碳', '氧氣', '氮氣', '氫氣'], ['下列何者是哺乳類？', '鯨魚', '鯊魚', '鱷魚', '章魚'], ['一大氣壓下水的沸點？', '100°C', '90°C', '120°C', '80°C'],
   ['地球自轉一圈約需？', '24 小時', '12 小時', '365 天', '30 天'], ['離太陽最近的行星是？', '水星', '金星', '地球', '火星'], ['聲音無法在哪裡傳播？', '真空', '水中', '空氣中', '鋼鐵中'], ['人體最大的器官是？', '皮膚', '肝臟', '心臟', '肺'],
   ['下列何者是再生能源？', '太陽能', '煤', '石油', '天然氣'], ['磁鐵的同極會？', '互相排斥', '互相吸引', '沒有作用', '融合'], ['水在幾度結冰？', '0°C', '10°C', '100°C', '-10°C'], ['植物主要靠什麼吸水？', '根', '葉', '花', '果實']],
  [['臺灣最高的山是？', '玉山', '雪山', '阿里山', '合歡山'], ['面積最大的洲是？', '亞洲', '非洲', '歐洲', '大洋洲'], ['三權分立：行政、立法與？', '司法', '監察', '考試', '軍事'], ['最先統一中國的朝代？', '秦朝', '漢朝', '唐朝', '宋朝'],
   ['面積最大的海洋是？', '太平洋', '大西洋', '印度洋', '北冰洋'], ['孫中山領導革命推翻了？', '清朝', '明朝', '元朝', '漢朝'], ['絲路連接中國與哪裡？', '中亞與歐洲', '南美洲', '澳洲', '北極'], ['赤道附近的氣候多屬？', '熱帶', '寒帶', '溫帶', '乾燥帶'],
   ['保障人民表達意見的是？', '言論自由', '服兵役', '繳稅', '義務教育'], ['北半球白天最長的節氣？', '夏至', '冬至', '春分', '秋分'], ['面積最小的洲是？', '大洋洲', '歐洲', '南極洲', '南美洲'], ['聯合國總部在哪個城市？', '紐約', '倫敦', '巴黎', '日內瓦']]
];

// 額外題庫：每個科目再補充題目，並與原題隨機混合
QB[0].push(['「學而不思則罔」的下一句？','思而不學則殆','三人行必有我師','溫故而知新','知之為知之'], ['「刻舟求劍」比喻？','拘泥成法，不知變通','做事非常迅速','勇於嘗試','珍惜時間'], ['《出師表》的作者是？','諸葛亮','曹操','司馬遷','陶淵明'], ['「紙上談兵」形容？','空談理論，不能解決實際問題','勤奮練習','善於溝通','勇敢作戰']);
QB[1].push(['What is the past tense of "write"?','wrote','written','writes','writing'], ['Choose the correct article: ___ apple','an','a','thee','some'], ['What is the opposite of "ancient"?','modern','old','historic','early'], ['They ___ playing football now.','are','is','am','be']);
QB[2].push(['15% of 240 = ?','36','24','30','42'], ['若 4x = 36，x = ?','9','8','12','6'], ['半徑 3 的圓，直徑是？','6','3','9','12'], ['2.5 × 4 = ?','10','8','12','6']);
QB[3].push(['植物行光合作用主要在哪個構造？','葉綠體','粒線體','細胞核','液胞'], ['地球的天然衛星是？','月球','火星','太陽','金星'], ['電流的常用單位是？','安培','伏特','瓦特','歐姆'], ['人體負責運送氧氣的血球是？','紅血球','白血球','血小板','神經細胞']);
QB[4].push(['臺灣位於哪個洋的西側？','太平洋','大西洋','印度洋','北冰洋'], ['世界上流量最大的河流是？','亞馬遜河','尼羅河','長江','密西西比河'], ['民主政治的重要原則之一是？','權力分立','世襲統治','君主專制','取消選舉'], ['地中海位於哪兩洲之間？','歐洲與非洲','亞洲與北美洲','南美洲與非洲','大洋洲與亞洲']);

// 事件: o=選項, c=金幣花費, r=可能結果(p=機率). e: hp/mhp/atk/dmax(護盾)/men/en/coins
const EV = [
  { n: '神秘商人', d: '斗篷商人攔住了你，攤開一排奇怪的瓶子…', o: [
    { l: '花 5 金幣買藥水', c: 5, r: [{ p: 1, t: '藥水沁入心脾。', e: { en: 40, hp: 15 } }] },
    { l: '搶走他的貨物', r: [{ p: .5, t: '得手了！', e: { coins: 10, atk: 1 } }, { p: .5, t: '被反擊了！', e: { hp: -15 } }] },
    { l: '禮貌離開', r: [{ p: 1, t: '商人微笑點頭。', e: { coins: 2 } }] }] },
  { n: '古老祭壇', d: '車廂縫隙中長出一座發光的祭壇…', o: [
    { l: '獻祭生命換取力量', r: [{ p: 1, t: '祭壇回應了你。', e: { hp: -20, atk: 3 } }] },
    { l: '誠心祈禱', r: [{ p: .5, t: '聖光籠罩！', e: { dmax: 6, hp: 10 } }, { p: .5, t: '毫無回應…', e: { hp: -5 } }] },
    { l: '花 8 金幣供奉', c: 8, r: [{ p: .85, t: '祭壇大放光明！', e: { dmax: 10, men: 10 } }, { p: .15, t: '供品被吞噬了。', e: {} }] }] },
  { n: '流浪劍客', d: '一名劍客坐在車頂，上下打量著你…', o: [
    { l: '切磋比試', r: [{ p: .65, t: '你領悟了劍意！', e: { atk: 4 } }, { p: .35, t: '被擊倒了…', e: { hp: -12 } }] },
    { l: '虛心請教', r: [{ p: 1, t: '獲益良多。', e: { atk: 2, men: 5 } }] },
    { l: '花 6 金幣請他喝酒', c: 6, r: [{ p: .9, t: '他傳授了秘技！', e: { atk: 3, men: 15 } }, { p: .1, t: '他喝醉睡著了。', e: {} }] }] },
  { n: '廢棄貨櫃', d: '一節脫軌的貨櫃卡在車頂旁，門半掩著…', o: [
    { l: '徒手搜索', r: [{ p: .6, t: '翻出一袋金幣！', e: { coins: 9 } }, { p: .4, t: '被機關夾傷！', e: { hp: -12 } }] },
    { l: '用劍撬開', r: [{ p: .8, t: '撬開了，裡面有補給。', e: { hp: 10, en: 20 } }, { p: .2, t: '劍刃卡住，耗費體力。', e: { en: -15 } }] },
    { l: '繞過去', r: [{ p: 1, t: '平安無事。', e: {} }] }] },
  { n: '火焰泉水', d: '車頂的裂縫湧出一汪燃燒的泉水…', o: [
    { l: '大口飲用', r: [{ p: 1, t: '熱流湧遍全身！', e: { men: 15, hp: -8 } }] },
    { l: '浸泡劍刃', r: [{ p: .7, t: '劍刃燃起火光！', e: { atk: 3 } }, { p: .3, t: '火焰反噬！', e: { hp: -14 } }] },
    { l: '離開', r: [{ p: 1, t: '你繼續前進。', e: {} }] }] },
  { n: '突擊抽考', d: '一隻戴眼鏡的幽靈攔住你：「來一題吧！」', o: [
    { l: '挑戰簡單題', r: [{ p: .9, t: '答對了！', e: { atk: 2 } }, { p: .1, t: '答錯了…', e: { hp: -5 } }] },
    { l: '挑戰困難題', r: [{ p: .45, t: '漂亮！智慧灌頂！', e: { atk: 6, men: 10 } }, { p: .55, t: '答錯被電到了！', e: { hp: -12 } }] },
    { l: '交白卷', r: [{ p: 1, t: '幽靈嘆了口氣。', e: {} }] }] },
  { n: '賭徒', d: '一個賭徒晃著骰子：「敢不敢賭一把？」', o: [
    { l: '花 5 金幣小賭', c: 5, r: [{ p: .5, t: '贏了！', e: { coins: 10 } }, { p: .5, t: '輸光了…', e: {} }] },
    { l: '花 12 金幣豪賭', c: 12, r: [{ p: .4, t: '大獲全勝！', e: { coins: 30 } }, { p: .6, t: '血本無歸…', e: {} }] },
    { l: '直接搶骰子', r: [{ p: .4, t: '骰子到手，運氣爆棚！', e: { atk: 2, coins: 6 } }, { p: .6, t: '被打了一頓！', e: { hp: -14 } }] }] },
  { n: '受傷的旅人', d: '路邊倒著一名滿身是血的旅人…', o: [
    { l: '替他包紮', r: [{ p: 1, t: '他感激地遞上一袋東西。', e: { hp: -5, coins: 8, men: 5 } }] },
    { l: '搜刮他的財物', r: [{ p: .6, t: '你拿走了他的錢。', e: { coins: 12 } }, { p: .4, t: '他拚死反抗！', e: { hp: -14 } }] },
    { l: '離開', r: [{ p: 1, t: '你頭也不回地離開。', e: {} }] }] },
  { n: '魔方碎片', d: '一枚散發紫光的碎片懸浮在半空…', o: [
    { l: '直接吸收', r: [{ p: .55, t: '力量湧入體內！', e: { dmax: 8, atk: 2 } }, { p: .45, t: '碎片反噬！', e: { hp: -18 } }] },
    { l: '用劍斬碎', r: [{ p: 1, t: '碎片化為能量。', e: { en: 50 } }] },
    { l: '花 10 金幣封印', c: 10, r: [{ p: 1, t: '封印後獲得穩定力量。', e: { dmax: 12 } }] }] },
  { n: '失控的列車員', d: '列車員瘋狂搖鈴：「前方軌道損壞！」', o: [
    { l: '協助維修', r: [{ p: .7, t: '修好了，他塞給你獎金。', e: { coins: 10 } }, { p: .3, t: '扳手砸到手…', e: { hp: -10 } }] },
    { l: '跳車繞行', r: [{ p: .5, t: '身手矯健！', e: { atk: 2 } }, { p: .5, t: '摔得很痛！', e: { hp: -12 } }] },
    { l: '無視他', r: [{ p: 1, t: '列車搖晃了一下。', e: {} }] }] }
  ,{ n: '裂界寶箱', d: '一只古老寶箱在車頂裂縫中浮現，箱內傳來低語…', o: [
    { l: '強行開啟', r: [{ p: .65, t: '寶箱噴出金幣！', e: { coins: 18, en: 10 } }, { p: .35, t: '詛咒爆發！', e: { hp: -18 } }] },
    { l: '花 8 金幣封印', c: 8, r: [{ p: 1, t: '封印穩定，獲得護佑。', e: { dmax: 12, hp: 8 } }] },
    { l: '轉身離開', r: [{ p: 1, t: '低語逐漸遠去。', e: {} }] }] },
  { n: '血月交易', d: '血月倒映在車窗上，一道聲音提出交換…', o: [
    { l: '獻出 15 生命換攻擊', r: [{ p: 1, t: '血月烙印燃起！', e: { hp: -15, atk: 5 } }] },
    { l: '獻出 12 金幣換護盾', c: 12, r: [{ p: 1, t: '紅光凝成護盾。', e: { dmax: 18 } }] },
    { l: '拒絕交易', r: [{ p: 1, t: '血月無聲退去。', e: {} }] }] },
  { n: '失落的補給車', d: '一節無人補給車與列車並行，門即將關閉！', o: [
    { l: '跳入搬運補給', r: [{ p: .7, t: '滿載而歸！', e: { hp: 12, en: 30, coins: 8 } }, { p: .3, t: '被甩出車廂！', e: { hp: -16 } }] },
    { l: '只拿金幣', r: [{ p: 1, t: '你迅速抓走錢袋。', e: { coins: 15 } }] },
    { l: '不冒險', r: [{ p: 1, t: '你穩住身形繼續前進。', e: {} }] }] }
];
const hs = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const mod = (a, n) => ((a % n) + n) % n, pk = (u, p) => 1 - Math.abs(mod(u, p) - p / 2) / (p / 2);
const R = (g, x, y, w, h, c) => { const o = g || window; o.fill(c); o.rect(Math.floor(x), Math.floor(y), w + .12, h + .12); };
function mkG(w, h, f) { const g = createGraphics(w, h); g.pixelDensity(1); g.noSmooth(); g.noStroke(); f(g); return g; }

function boxcar(g, x0, w, p, sd, v2) {
  R(g, x0, 58, w, 24, p.b);
  for (let px = x0; px < x0 + w; px += 4) R(g, px, 60, 1, 18, p.s);
  R(g, x0, 58, w, 3, p.d); R(g, x0, 58, w, 1, p.h); R(g, x0, 78, w, 4, p.d);
  const dx = v2 ? x0 + 14 : x0 + Math.floor(w / 2) - 14;
  R(g, dx - 1, 60, 30, 19, p.d); R(g, dx, 61, 28, 17, p.o);
  for (let k = 0; k < 28; k += 4) R(g, dx + k, 61, 1, 17, p.s);
  for (let i = 0; i < 17; i++) R(g, dx + 3 + Math.floor(i * 1.4), 77 - i, 2, 1, p.d);
  R(g, dx + 22, 67, 1, 5, '#e0c880');
  for (const px of [x0 + 8, x0 + w - 8]) for (const ry of [62, 68, 74]) R(g, px, ry, 1, 1, p.h);
  const pl = v2 ? x0 + 68 : x0 + w - 20;
  R(g, pl, 62, 10, 6, '#e8dcc0'); for (let k = 0; k < 4; k++) R(g, pl + 1 + k * 2, 64, 1, 3, '#3a2a22');
  if (v2) for (let k = 0; k < 4; k++) R(g, x0 + 50, 63 + k * 2, 14, 1, p.d);
  for (let i = 0; i < 30; i++) R(g, x0 + Math.floor(hs(i * 3 + sd) * w), 60 + Math.floor(hs(i * 7 + sd) * 18), 1, 1 + i % 3, [p.s, '#7a4a2a', p.h][i % 3]);
  R(g, x0 - 1, 54, w + 2, 1, '#cfae7e'); R(g, x0 - 1, 55, w + 2, 2, '#a8845a');
  for (let px = x0 + 3; px < x0 + w; px += 7) R(g, px, 54, 1, 3, '#6f5438');
  R(g, x0 - 1, 57, w + 2, 1, '#2a1f26'); R(g, x0 + 2, 82, w - 4, 2, '#17131f');
  for (const b of [x0 + 14, x0 + w - 14]) { R(g, b - 9, 83, 18, 2, '#120f18'); R(g, b - 6, 84, 3, 3, '#d1a42b'); R(g, b + 4, 84, 3, 3, '#d1a42b'); }
  R(g, x0 + w, 78, 6, 3, '#17131f'); R(g, x0 + 1, 60, 1, 22, '#17131f'); R(g, x0 + 5, 60, 1, 22, '#17131f');
  for (let k = 0; k < 7; k++) R(g, x0 + 1, 62 + k * 3, 5, 1, '#17131f');
}
function tender(g) {
  R(g, 166, 60, 20, 22, '#25232e'); R(g, 166, 58, 20, 3, '#3a3745');
  for (let px = 166; px < 186; px++) { const h = 6 + Math.floor(hs(px * 1.7) * 7); R(g, px, 58 - h, 1, h, '#15131b'); if (hs(px * 3.1) > .6) R(g, px, 58 - h, 1, 1, '#54506a'); }
  for (let px = 168; px < 186; px += 4) for (const ry of [62, 76]) R(g, px, ry, 1, 1, '#6a6578');
  R(g, 166, 70, 20, 2, '#d1a42b'); R(g, 167, 62, 2, 3, '#e63946'); R(g, 166, 82, 20, 2, '#120f18');
  R(g, 171, 84, 3, 3, '#d1a42b'); R(g, 180, 84, 3, 3, '#d1a42b');
  R(g, 186, 38, 6, 46, '#2b5a3c'); R(g, 186, 38, 1, 46, '#3f7d55'); R(g, 185, 34, 7, 4, '#18301f');
  R(g, 188, 46, 4, 10, '#17131f'); R(g, 189, 47, 3, 8, '#ffb85c'); R(g, 186, 62, 6, 2, '#d1a42b');
}

function setup() {
  createCanvas(windowWidth, windowHeight); pixelDensity(Math.max(1, Math.floor(displayDensity())));
  document.body.style.margin = '0'; document.body.style.overflow = 'hidden'; document.body.style.background = '#07030f';
  applySet(); layout();
  const SB = [12, 26, 38, 48, 58, 68], SC = ['#1f2250', '#363072', '#6a3f86', '#a64f8a', '#e0687a', '#f79a6b', '#fcc47e'];
  sky = mkG(W, H, g => {
    for (let y = 0; y < H; y++) { let i = 0; while (i < SB.length && y >= SB[i]) i++;
      for (let x = 0; x < W; x++) { let c = SC[i]; if (i < SB.length && SB[i] - y <= 3 && (x + y) % 2 === 0) c = SC[i + 1]; R(g, x, y, 1, 1, c); } }
    for (let dy = -28; dy <= 28; dy++) for (let dx = -28; dx <= 28; dx++) { const d = Math.hypot(dx, dy), x = 62 + dx, y = 58 + dy;
      if (d <= 9) R(g, x, y, 1, 1, d < 6 ? '#fff7d0' : '#ffe39a');
      else if (d <= 14 && (x + y) % 2 === 0) R(g, x, y, 1, 1, '#ffd08a');
      else if (d <= 22 && x % 2 === 0 && y % 2 === 0) R(g, x, y, 1, 1, '#ffbf86'); }
  });
  bal = mkG(W, 16, g => { R(g, 0, 0, W, 16, '#4d3d49');
    for (let i = 0; i < 150; i++) R(g, Math.floor(hs(i * 2.3) * W), Math.floor(hs(i * 5.1) * 16), 1 + Math.floor(hs(i * 7.7) * 2), 1, ['#6b5866', '#3a2c38', '#7d6a74'][i % 3]);
    for (let k = 0; k < 16; k++) { R(g, k * 12 + 2, 0, 6, 5, '#2c2029'); R(g, k * 12 + 2, 0, 6, 1, '#43303e'); } });
  fgG = mkG(W, 10, g => { for (let x = 0; x < W; x++) { const hh = 2 + Math.floor(hs(Math.floor(x / 2) * 3.3) * 5); R(g, x, 10 - hh, 1, hh, '#120d24'); if (hs(x * 1.3) > .93) R(g, x, 7 - hh, 1, 3, '#120d24'); } });
  trG = [mkG(W, H, g => boxcar(g, -10, 82, P1, 3, false)), mkG(W, H, g => boxcar(g, 78, 82, P2, 11, true)), mkG(W, H, tender)];
  mkEye(); initStars();
  coverInit();
  COVER.onStart = function () {
    aud();
    st = 'mini';
    mi = 0;
    startNode();
  };
  reset();
}

function applySet() { noSmooth(); noStroke(); textFont('Noto Sans TC, Microsoft JhengHei, PingFang TC, sans-serif'); }
// 真正滿版：世界座標依視窗寬高分別縮放，不再保留黑邊
function layout() { SX = width / W; SY = height / H; S = Math.min(SX, SY); ox = 0; oy = 0; }
function windowResized() { resizeCanvas(windowWidth, windowHeight); applySet(); layout(); }

function reset() {
  P = { x: 30, y: GY, vy: 0, hp: 150, mhp: 150, atk: 14, def: 24, en: 60, men: 120, coins: 0, sw: -1, cb: 0, cbT: 0, cast: -1, casted: false, hit: false, mv: 0, dmax: 24, inv: 0, nh: 0, pm: 1, ls: 0, invT: 1.25, pen: .25, rel: [], face: 1, er: 1, cc: 25, mm: 1, spd: .12, dr: 3, sl: 0, ec: 0, rev: 0, ck: 0, fireDmg: 0, burnDmg: 0, burnTime: 0, weaponPct: 0, equip: [] };
  B = { x: 158, y: 34, hp: 2600, mhp: 2600, fl: 0, ch: 0, cd: 2, at: null, phase: 1, form: 'cube', formT: 0, dash: 0, dashCd: 2.2, dir: -1, shield: 0, touchCd: 0 };
  parts = []; proj = []; pops = []; sm = []; Bl = []; En = []; MYS = false; FD = 0; RLt = 0; RLmsg = ''; qOk = true; nbT = 0; bannerT = 0; endT = 0; hst = 0; sh = 0;
  evs = EV.slice().sort(() => random() - .5); evi = 0; mi = 0; M = null; st = 'title'; TS = AC ? 'menu' : 'gate'; TT = 6; TSel = 0;
  if (COVER.pg) coverReset();
}

// ---------- 主迴圈 ----------
function draw() {
  const rdt = Math.min(.05, deltaTime / 1000); t += rdt; if (st === 'title' && TS !== 'gate') TT += rdt; if (AC) mus(musWant()); RLt = Math.max(0, RLt - rdt);
  let dt = rdt; if (hst > 0) { hst -= rdt; dt = 0; }
  background('#07030f');

  if (st === 'title') {
    coverDraw();
    if (FD > 0) { FD = Math.max(0, FD - rdt * .9); fill(0, 0, 0, FD * 255); rect(0, 0, width, height); }
    return;
  }

  push(); translate(ox, oy); scale(SX, SY);
  if (sh > 0) { translate(random(-sh, sh), random(-sh, sh)); sh = Math.max(0, sh - rdt * 14); }
  scene(dt, rdt);
  pop();
  // 場景已拉伸填滿視窗，無需繪製黑邊
  titleFx();
  if (FD > 0) { FD = Math.max(0, FD - rdt * .9); fill(0, 0, 0, FD * 255); rect(0, 0, width, height); }
  push(); translate(ox, oy); scale(SX / 4, SY / 4); // UI 同步滿版
  if (st === 'mini') { updMini(rdt); if (st === 'mini' && M) drawMini(); }
  else hud(rdt);
  pop();
}

// =====================================================================
//  終末的實驗 — 封面 / 開始畫面（p5.js）
//  所有名稱皆以 COVER / cover 開頭，避免與既有程式衝突。
// =====================================================================

const COVER = {
  W: 320, H: 180,                 // 內部像素畫布解析度（會等比放大）
  pg: null,
  t0: 0,
  sel: 0,
  page: 'main',                   // 'main' | 'intro' | 'controls'
  leaving: 0,
  embers: [],
  menuRects: [],
  menu: ['開始遊戲', '遊戲介紹', '操作說明'],
  onStart: null,
  title: '終末的實驗',
  subtitle: 'T H E   F I N A L   E X P E R I M E N T',
  introText: [
    '一列永不停靠的列車，載著被選中的人駛向終點。',
    '你必須在行駛的車頂上與敵人搏鬥，穿越一個又一個節點，並在五大學科的試煉中前進。',
    '魔王只是棋子。真正的操縱者，始終躲在黑暗裡，靜靜注視著這場實驗。',
    '武器、裝備、藥水與奇物，將決定你能走多遠。'
  ],
  controlsText: [
    'A / D 或 ← / →：左右移動',
    'W 或 ↑：跳躍',
    'J：普攻（連按三連擊）',
    'K：火鳳凰（消耗 30 能量）',
    'F：全螢幕 M：音樂開關',
    '小遊戲 / 題目 / 事件：依提示或數字鍵操作'
  ]
};

// 幕後黑手輪廓（回眸，兜帽朝左，披風向右下垂落）
const COVER_SIL = [
  [193, 62], [191, 50], [196, 38], [206, 29], [220, 27], [233, 33],
  [241, 46], [244, 60], [250, 72], [268, 82], [282, 100], [292, 130],
  [298, 180], [130, 180], [138, 140], [150, 110], [170, 88], [190, 76], [196, 70]
];

function coverInit() {
  COVER.pg = createGraphics(COVER.W, COVER.H);
  COVER.pg.pixelDensity(1);
  COVER.pg.noSmooth();
  COVER.embers = [];
  for (let i = 0; i < 46; i++) COVER.embers.push(coverNewEmber(true));
  coverReset();
}

function coverReset() {
  COVER.t0 = millis();
  COVER.sel = 0;
  COVER.page = 'main';
  COVER.leaving = 0;
}

function coverNewEmber(randomY) {
  return {
    x: random(130, 310),
    y: randomY ? random(0, COVER.H) : COVER.H + 2,
    vy: random(0.05, 0.18),
    ph: random(TAU),
    a: random(0.3, 1)
  };
}

function coverSilhouette(g, ox, oy) {
  g.beginShape();
  for (const p of COVER_SIL) g.vertex(p[0] + ox, p[1] + oy);
  g.endShape(CLOSE);
}

// ---------------------------------------------------------------------
//  像素畫布：幕後黑手
// ---------------------------------------------------------------------
function coverRenderFigure(t) {
  const g = COVER.pg;
  const rim = coverEase(constrain((t - 2.6) / 3.0, 0, 1));
  const body = coverEase(constrain((t - 3.2) / 3.0, 0, 1));
  let open = coverEase(constrain((t - 1.4) / 1.4, 0, 1));

  // 偶爾眨眼
  const bp = t % 6.5;
  let blink = 1;
  if (t > 4 && bp > 6.2) blink = abs(bp - 6.35) / 0.15;
  blink = constrain(blink, 0.05, 1);
  open *= blink;

  // 呼吸式閃爍
  const flick = 0.86 + 0.1 * sin(t * 6.3) + 0.04 * noise(t * 9);

  g.background(0);
  g.noStroke();

  g.push();
  g.translate(14, 0);

  // 輪廓光（右側與上緣的暗紅反光）
  g.fill(210 * rim, 26 * rim, 32 * rim);
  coverSilhouette(g, 2, -1);
  g.fill(120 * rim, 12 * rim, 20 * rim);
  coverSilhouette(g, 1, 0);

  // 身體（近乎純黑）
  g.fill(lerp(0, 18, body), lerp(0, 10, body), lerp(0, 14, body));
  coverSilhouette(g, 0, 0);

  // 披風皺褶
  g.stroke(34, 14, 20, 170 * body);
  g.strokeWeight(1);
  g.line(170, 100, 160, 180);
  g.line(200, 112, 195, 180);
  g.line(235, 100, 250, 180);
  g.line(257, 92, 272, 150);
  g.line(214, 34, 231, 62);
  g.line(228, 66, 240, 98);
  g.noStroke();

  // 兜帽內的純黑陰影
  g.fill(0);
  g.ellipse(201, 54, 17, 23);

  // 眼睛位置
  const ex = 199, ey = 52;
  const eg = open * flick;

  if (eg > 0.01) {
    // 紅色光暈（加色混合）
    g.blendMode(ADD);
    const layers = [[40, 5], [30, 6], [22, 8], [15, 11], [10, 15]];
    for (const L of layers) {
      g.fill(255, 20, 20, L[1] * eg);
      g.ellipse(ex, ey, L[0] * 2, L[0] * 1.4);
    }
    // 橫向鏡頭光芒
    g.fill(255, 30, 30, 22 * eg);
    g.rect(ex - 34, ey, 68, 1);
    g.fill(255, 30, 30, 10 * eg);
    g.rect(ex - 20, ey - 1, 40, 3);
    g.blendMode(BLEND);

    // 眼球
    const h = max(0.6, 5 * open);
    g.fill(130, 0, 8);
    g.ellipse(ex, ey, 12, h + 2);
    g.fill(255, 40, 30);
    g.ellipse(ex, ey, 10, h);
    g.fill(255, 130, 95);
    g.ellipse(ex - 1, ey, 6, max(1, h - 2));
    if (h > 2.4) {
      g.fill(40, 0, 0);
      g.rect(ex - 1, ey - floor(h / 2), 1, floor(h));      // 豎瞳
    }
    g.fill(255, 235, 205);
    g.rect(ex - 3, ey - 1, 1, 1);                          // 高光

    // 壓低的眉骨陰影（讓眼神更冷酷）
    g.fill(0);
    g.quad(ex - 8, ey - 1, ex + 8, ey - 4, ex + 8, ey - 9, ex - 8, ey - 9);
    g.quad(ex - 8, ey + 4, ex + 8, ey + 3, ex + 8, ey + 9, ex - 8, ey + 9);
  }
  g.pop();

  // 飄散的暗紅餘燼
  for (const e of COVER.embers) {
    e.y -= e.vy;
    e.x += sin(t * 0.8 + e.ph) * 0.06;
    if (e.y < -2) Object.assign(e, coverNewEmber(false));
    const a = 150 * e.a * rim * (0.5 + 0.5 * sin(t * 2 + e.ph));
    if (a > 4) {
      g.fill(255, 50, 40, a);
      g.rect(floor(e.x), floor(e.y), 1, 1);
    }
  }

  // 細微顆粒雜訊
  g.fill(255, 255, 255, 9);
  for (let i = 0; i < 70; i++) g.rect(floor(random(COVER.W)), floor(random(COVER.H)), 1, 1);
}

function coverEase(x) { return x * x * (3 - 2 * x); }

// ---------------------------------------------------------------------
//  主繪製
// ---------------------------------------------------------------------
function coverDraw() {
  if (!COVER.pg) coverInit();
  const t = (millis() - COVER.t0) / 1000;

  background(0);
  coverRenderFigure(t);

  const s = min(width / COVER.W, height / COVER.H);
  const dx = (width - COVER.W * s) / 2;
  const dy = (height - COVER.H * s) / 2;

  push();
  noSmooth();
  image(COVER.pg, dx, dy, COVER.W * s, COVER.H * s);
  pop();

  const titleA = coverEase(constrain((t - 5.0) / 1.6, 0, 1));
  const menuA = coverEase(constrain((t - 6.0) / 1.2, 0, 1));

  if (COVER.page === 'main') {
    coverDrawTitle(dx, dy, s, titleA, t);
    coverDrawMenu(dx, dy, s, menuA, t);
  } else {
    coverDrawPage(dx, dy, s, t);
  }

  // 跳過提示
  if (t < 6.5 && COVER.page === 'main') {
    noStroke();
    textAlign(RIGHT, BOTTOM);
    textSize(max(10, s * 3.2));
    fill(120, 100, 100, 110);
    text('按任意鍵跳過', width - 14, height - 10);
  }

  // 離開淡出
  if (COVER.leaving > 0) {
    const k = constrain((millis() - COVER.leaving) / 800, 0, 1);
    noStroke();
    fill(0, 255 * k);
    rect(0, 0, width, height);
    if (k >= 1) {
      COVER.leaving = 0;
      coverStartGame();
    }
  }
}

function coverFont() {
  textFont("'Microsoft JhengHei','PingFang TC','Noto Sans TC','Courier New',monospace");
}

function coverGlowText(str, x, y, size, col, glow, blur, alpha) {
  const ctx = drawingContext;
  push();
  coverFont();
  textStyle(BOLD);
  textSize(size);
  noStroke();
  ctx.shadowColor = glow;
  ctx.shadowBlur = blur;
  // 暗色像素陰影
  fill(30, 0, 4, alpha);
  text(str, x + size * 0.07, y + size * 0.07);
  fill(red(col), green(col), blue(col), alpha);
  text(str, x, y);
  ctx.shadowBlur = 0;
  pop();
}

function coverDrawTitle(dx, dy, s, a, t) {
  if (a <= 0.01) return;
  const x = dx + 20 * s;
  const y = dy + 56 * s;
  const size = s * 9.5;
  const flick = 0.9 + 0.1 * sin(t * 5.1);

  push();
  textAlign(LEFT, CENTER);
  const alpha = 255 * a;

  // 偶發的故障位移
  if (random() < 0.012) {
    coverGlowText(COVER.title, x - s * 0.8, y, size, color(255, 30, 40), 'rgba(0,0,0,0)', 0, alpha * 0.5);
  }
  coverGlowText(COVER.title, x, y, size, color(214, 205, 200), 'rgba(190,0,20,' + (0.55 * flick) + ')', 18, alpha);

  // 副標題與細線
  coverFont();
  textStyle(NORMAL);
  textSize(max(8, s * 2.6));
  noStroke();
  fill(150, 30, 36, alpha * 0.9);
  text(COVER.subtitle, x, y + size * 0.95);
  stroke(120, 14, 22, alpha * 0.8);
  strokeWeight(max(1, s * 0.4));
  line(x, y + size * 0.6, x + size * 5.1, y + size * 0.6);
  pop();
}

function coverDrawMenu(dx, dy, s, a, t) {
  if (a <= 0.01) return;
  COVER.menuRects = [];
  const x = dx + 22 * s;
  const y0 = dy + 108 * s;
  const gap = 16 * s;
  const size = s * 6.2;

  push();
  textAlign(LEFT, CENTER);
  coverFont();
  textSize(size);
  for (let i = 0; i < COVER.menu.length; i++) {
    const y = y0 + i * gap;
    const w = textWidth(COVER.menu[i]) + size * 1.6;
    COVER.menuRects.push({ x: x - size * 0.4, y: y - gap * 0.45, w: w, h: gap * 0.9 });

    const on = i === COVER.sel;
    const alpha = 255 * a;
    if (on) {
      const pulse = 0.75 + 0.25 * sin(t * 6);
      coverGlowText('▶', x, y, size * 0.8, color(230, 40, 44), 'rgba(220,0,20,0.9)', 12, alpha * pulse);
      coverGlowText(COVER.menu[i], x + size * 1.2, y, size, color(238, 214, 208), 'rgba(200,0,20,0.7)', 14, alpha);
    } else {
      coverGlowText(COVER.menu[i], x + size * 1.2, y, size, color(110, 98, 98), 'rgba(0,0,0,0)', 0, alpha);
    }
  }
  pop();
}

// 遊戲介紹 / 操作說明 子頁面
function coverDrawPage(dx, dy, s, t) {
  const px = dx + 12 * s, py = dy + 14 * s;
  const pw = 150 * s, ph = 152 * s;

  push();
  noStroke();
  fill(0, 238);
  rect(px, py, pw, ph);
  noFill();
  stroke(110, 12, 22);
  strokeWeight(max(1, s * 0.5));
  rect(px, py, pw, ph);
  stroke(40, 4, 8);
  rect(px + s * 2, py + s * 2, pw - s * 4, ph - s * 4);

  noStroke();
  textAlign(LEFT, TOP);
  coverFont();

  const head = COVER.page === 'intro' ? '遊戲介紹' : '操作說明';
  coverGlowText(head, px + s * 7, py + s * 7, s * 7, color(226, 60, 60), 'rgba(200,0,20,0.8)', 12, 255);

  const size = s * 4.8;
  textSize(size);
  textStyle(NORMAL);
  fill(205, 196, 192);
  let y = py + s * 22;
  const maxW = pw - s * 14;
  const lines = COVER.page === 'intro' ? COVER.introText : COVER.controlsText;
  for (const para of lines) {
    for (const ln of coverWrap(para, maxW)) {
      text(ln, px + s * 7, y);
      y += size * 1.55;
    }
    y += size * 0.5;
  }

  textSize(max(9, s * 3.4));
  textAlign(LEFT, BOTTOM);
  fill(130, 40, 46, 150 + 80 * sin(t * 4));
  text('按 ESC 或點擊畫面返回', px + s * 7, py + ph - s * 5);
  pop();
}

// 依像素寬度自動換行（適合中文）
function coverWrap(str, maxW) {
  const out = [];
  let cur = '';
  for (const ch of str) {
    if (textWidth(cur + ch) > maxW) {
      out.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}

// ---------------------------------------------------------------------
//  互動
// ---------------------------------------------------------------------
function coverStartGame() {
  if (typeof COVER.onStart === 'function') COVER.onStart();
  else if (typeof startGame === 'function') startGame();
  else console.log('[封面] 請設定 COVER.onStart 或定義 startGame()');
}

function coverSkipIntro() {
  const t = (millis() - COVER.t0) / 1000;
  if (t < 7) {
    COVER.t0 = millis() - 7000;
    return true;
  }
  return false;
}

function coverChoose(i) {
  if (COVER.leaving > 0) return;
  if (i === 0) COVER.leaving = millis();
  else if (i === 1) COVER.page = 'intro';
  else if (i === 2) COVER.page = 'controls';
}

function coverMousePressed() {
  if (COVER.leaving > 0) return true;
  if (coverSkipIntro()) return true;
  if (COVER.page !== 'main') {
    COVER.page = 'main';
    return true;
  }
  for (let i = 0; i < COVER.menuRects.length; i++) {
    const r = COVER.menuRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      COVER.sel = i;
      coverChoose(i);
      return true;
    }
  }
  return true;
}

function coverMouseMoved() {
  if (st !== 'title' || COVER.page !== 'main') return;
  for (let i = 0; i < COVER.menuRects.length; i++) {
    const r = COVER.menuRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      COVER.sel = i;
    }
  }
}

function coverKeyPressed() {
  if (COVER.leaving > 0) return true;
  if (coverSkipIntro()) return true;

  if (COVER.page !== 'main') {
    if (keyCode === ESCAPE || keyCode === ENTER || keyCode === BACKSPACE || key === ' ') {
      COVER.page = 'main';
    }
    return true;
  }

  const n = COVER.menu.length;
  if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
    COVER.sel = (COVER.sel + n - 1) % n;
  } else if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
    COVER.sel = (COVER.sel + 1) % n;
  } else if (keyCode === ENTER || key === ' ' || key === 'j' || key === 'J') {
    coverChoose(COVER.sel);
  }
  return true;
}

if (typeof window !== 'undefined' && typeof window.mouseMoved === 'undefined') {
  window.mouseMoved = function () { coverMouseMoved(); };
}

function mousePressed() {
  aud();
  if (st === 'title' && coverMousePressed()) return;
}

function trees(off, p, base, mn, rg, col) {
  for (let x = 0; x < W; x++) { const u = x + off, idx = Math.floor(u / p), m = mod(u, p), half = p / 2;
    const hh = hs(idx * 1.37) > .2 ? mn + Math.floor(hs(idx * 2.9) * rg) : 0; if (!hh) continue;
    const v = Math.floor(hh * (1 - Math.abs(m - half) / half)), top = base - Math.max(0, v - (v % 3 === 0 ? 1 : 0));
    R(null, x, top, 1, base - top, col); }
}
function wheel(cx, cy, r, a) {
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const d = dx * dx + dy * dy; if (d <= r * r + 1) R(null, cx + dx, cy + dy, 1, 1, d >= r * r - 3 ? '#2e2838' : '#16121e'); }
  for (let s = 0; s < 3; s++) { const g = a + s * Math.PI / 3; for (let k = 1; k < r; k++) { const ox = Math.round(Math.cos(g) * k), oy = Math.round(Math.sin(g) * k); R(null, cx + ox, cy + oy, 1, 1, '#bfb4bb'); R(null, cx - ox, cy - oy, 1, 1, '#bfb4bb'); } }
  R(null, cx, cy, 1, 1, '#d1a42b');
}
function burst(x, y, n, cols, sp) {
  for (let i = 0; i < n; i++) { const a = random(TWO_PI), v = random(.3, 1) * sp;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: random(.3, .8), m: .8, c: random(cols), s: random() < .3 ? 2 : 1, g: 40 }); }
}

function scene(dt, rdt) {
  if (MYS) drawMystic(rdt); else {
  image(sky, 0, 0, W, H);
  for (const q of [[10, 14, 7, 24], [120, 24, 10, 20], [200, 36, 13, 28]]) { const x = mod(q[0] - t * q[2], 260) - 40;
    R(null, x, q[1], q[3], 2, '#ffb8a0'); R(null, x + 4, q[1] - 2, q[3] - 10, 2, '#ffb8a0'); R(null, x - 3, q[1] + 2, q[3] + 6, 2, '#c25f80'); }
  for (let x = 0; x < W; x++) {
    let u = x + t * 10, h = pk(u, 90) * .55 + pk(u + 23, 37) * .3 + pk(u + 5, 13) * .15, tp = Math.floor(62 - h * 38);
    R(null, x, tp, 1, 70 - tp, '#4a3168'); R(null, x, tp, 1, 1, '#b0709e');
    u = x + t * 30; h = pk(u, 60) * .5 + pk(u + 11, 23) * .5; tp = Math.floor(66 - h * 20); R(null, x, tp, 1, 66 - tp, '#33264f');
  }
  trees(t * 90, 18, 62, 8, 8, '#241a3c'); trees(t * 150, 26, 60, 10, 8, '#17102b');
  const bo = Math.floor(mod(t * 380, W)); image(bal, -bo, 94, W, 16); image(bal, W - bo, 94, W, 16);
  R(null, 0, 92, W, 1, '#cfc3c8'); R(null, 0, 93, W, 1, '#6b5b6a');
  for (const cx of WH) wheel(cx, 88, 4, t * 20);
  trG.forEach((g, i) => image(g, 0, -(Math.floor(t * 18 + i * .5) % 2), W, H));
  // 煙與火星 (來自畫面外的火車頭)
  if (random() < rdt * 16) sm.push({ x: 198, y: 34, a: 0, vx: -110 - random(25), vy: -7 - random(6) });
  for (let i = sm.length - 1; i >= 0; i--) { const p = sm[i]; p.a += rdt; p.x += p.vx * rdt; p.y += p.vy * rdt;
    if (p.a > 2.2) { sm.splice(i, 1); continue; }
    const z = 4 + Math.floor(p.a * 3.2); drawingContext.globalAlpha = Math.max(0, .7 - p.a / 3);
    R(null, p.x - z / 2, p.y - z / 2, z, z, `rgb(${238 - p.a * 45 | 0},${214 - p.a * 60 | 0},${212 - p.a * 45 | 0})`); }
  drawingContext.globalAlpha = 1;

  }
  if (st === 'battle' || st === 'nb') updBattle(dt);
  if (B.fl > 0) B.fl -= rdt;
  if (st === 'title' && TS !== 'gate' && random() < rdt * 35) parts.push({ x: random(W), y: H + 2, vx: random(-8, 8), vy: random(-34, -12), l: 2.6, m: 2.6, c: random(['#ff9a1f', '#ffe36a', '#c58aff', '#ff3b1f']), s: random() < .3 ? 2 : 1, g: 0 });
  if (!MYS && (B.hp > 0 || endT < .4)) { if (st === 'title') { push(); translate(B.x, B.y); scale(1.7); translate(-B.x, -B.y); drawBoss(); pop(); } else drawBoss(); }
  drawEnemies();
  for (const p of proj) drawPhoenix(p);
  drawPlayer(); drawBullets();
  for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.l -= rdt; if (p.l <= 0) { parts.splice(i, 1); continue; }
    p.vy += p.g * rdt; p.x += p.vx * rdt; p.y += p.vy * rdt;
    drawingContext.globalAlpha = Math.min(1, p.l / p.m * 1.5); R(null, p.x, p.y, p.s, p.s, p.c); }
  drawingContext.globalAlpha = 1;
  if (!MYS) { const fo = Math.floor(mod(t * 640, W)); image(fgG, -fo, 98, W, 10); image(fgG, W - fo, 98, W, 10); }
  if (!MYS) { drawingContext.globalAlpha = .07; R(null, 0, 0, W, H, '#ff8a50'); drawingContext.globalAlpha = 1; }
}

// ---------- 主角 ----------
function blade(x, y, a, len, w, c, e) { for (let i = 0; i < len; i++) R(null, x + Math.cos(a) * i, y + Math.sin(a) * i, w, w, i > len - 3 ? e : c); }
function trail(x, y, a, d, len, w, c) {
  for (let k = 5; k >= 1; k--) { drawingContext.globalAlpha = .55 - k * .09; const aa = a - d * k * .22;
    blade(x, y, aa, len, w, c, c); R(null, x + Math.cos(aa) * (len + 3), y + Math.sin(aa) * (len + 3), 2, 2, c); }
  drawingContext.globalAlpha = 1;
}
function wSword(hx, hy, a) {
  const c = Math.cos(a), s = Math.sin(a);
  blade(hx, hy, a, 16, 1, '#f4f8ff', '#bfe3ff'); blade(hx + 1, hy, a, 12, 1, '#c6d6f0', '#c6d6f0');
  for (let k = -2; k <= 2; k++) R(null, hx + c * 2 - s * k, hy + s * 2 + c * k, 1, 1, '#e0b030');
  R(null, hx - c * 2, hy - s * 2, 2, 2, '#7a5a30'); R(null, hx - c * 4, hy - s * 4, 2, 2, '#e0b030');
}
function kSword(hx, hy, a) {
  const c = Math.cos(a), s = Math.sin(a);
  blade(hx, hy, a, 18, 3, '#2a1d40', '#a24bff'); blade(hx + 1, hy + 1, a, 16, 1, '#5a3a90', '#d9a6ff');
  for (let i = 5; i < 17; i += 4) if (Math.floor(t * 6 + i) % 2) R(null, hx + c * i + 1, hy + s * i + 1, 1, 1, '#e0b0ff');
  for (let k = -3; k <= 3; k++) R(null, hx + c - s * k, hy + s + c * k, 1, 1, '#6a6a7a');
  R(null, hx - c * 3, hy - s * 3, 2, 2, '#444444');
}
function drawPlayer() {
  if (P.inv > 0 && Math.floor(t * 16) % 2) return;
  push(); translate(Math.floor(P.x), 0); scale(P.face, 1); translate(-Math.floor(P.x), 0);
  const x = Math.floor(P.x), y = Math.floor(P.y), sw = P.sw, air = P.y < GY - 1, mv = P.mv && !air;
  const br = !mv && !air && sw < 0 && P.cast < 0 ? Math.floor(t * 3) % 2 : 0, ph = t * 12, ux = x + (sw >= .1 && sw < .65 ? 1 : 0), uy = y - br;
  let wa = 1.1, ba = -2.5, bw = false;
  if (sw >= 0) { const e = 1 - Math.pow(1 - Math.min(1, sw / .6), 2);
    if (P.cb === 0) wa = -2.2 + 3.1 * e; else if (P.cb === 1) { ba = -2.6 + 3.3 * e; bw = true; } else { wa = -1.4 + 1.9 * e; ba = 1.4 - 1.6 * e; bw = true; } }
  if (P.cast >= 0) wa = -1.5;
  const SK = '#f3c9a0', SS = '#d6a07a', HR = '#e9edf7', CT = '#2c3f8f', CS = '#1d2a66', CH = '#4a63c9', PT = '#262b44', BT = '#171a2b', hx = ux + 5, hy = uy - 13;
  drawingContext.globalAlpha = air ? .15 : .35; R(null, x - 5, GY, 11, 1, '#000000'); drawingContext.globalAlpha = 1;
  if (!bw) kSword(ux - 3, hy, ba);
  for (let i = 0; i < 4; i++) R(null, ux - 5 - i, uy - 9 + i + Math.round(Math.sin(t * 18 + i)), 2, 3, i % 2 ? CS : CT);
  if (air) { R(null, x - 3, y - 9, 3, 5, PT); R(null, x + 1, y - 8, 3, 4, PT); R(null, x - 4, y - 5, 4, 3, BT); R(null, x + 1, y - 5, 5, 3, BT); }
  else { const a = mv ? Math.round(Math.sin(ph) * 2) : 0, b = mv ? -a : 0, la = mv ? Math.max(0, Math.round(Math.cos(ph))) : 0, lb = mv ? Math.max(0, Math.round(-Math.cos(ph))) : 0;
    R(null, x - 3 + a, y - 9, 3, 5 - la, PT); R(null, x + 1 + b, y - 9, 3, 5 - lb, PT);
    R(null, x - 4 + a, y - 4 - la, 4, 4, BT); R(null, x + 1 + b, y - 4 - lb, 5, 4, BT); R(null, x - 4 + a, y - 4 - la, 4, 1, '#3a4066'); R(null, x + 1 + b, y - 4 - lb, 5, 1, '#3a4066'); }
  R(null, ux - 4, uy - 16, 8, 7, CT); R(null, ux + 2, uy - 16, 2, 7, CS); R(null, ux - 4, uy - 16, 1, 7, CH);
  R(null, ux - 1, uy - 16, 1, 5, '#eef0fa'); R(null, ux - 4, uy - 10, 8, 1, '#2a1d14'); R(null, ux, uy - 10, 2, 1, '#e0b030');
  R(null, ux - 5, uy - 17, 3, 3, '#1b1426'); R(null, ux - 5, uy - 17, 3, 1, '#a24bff'); R(null, ux + 3, uy - 17, 3, 3, '#eef0fa'); R(null, ux + 3, uy - 15, 3, 1, '#b9c2e0');
  for (let i = 0; i < 8; i++) R(null, ux - 3 - i, uy - 17 + (i >> 1) + Math.round(Math.sin(t * 20 + i * .8) * 1.5), 2, i < 3 ? 2 : 1, i % 2 ? '#b82a36' : '#e63946');
  R(null, ux - 3, uy - 23, 6, 6, SK); R(null, ux - 3, uy - 19, 6, 2, SS); R(null, ux - 5, uy - 23, 2, 5, '#aab4d4'); R(null, ux - 4, uy - 25, 8, 3, HR);
  R(null, ux - 4, uy - 27, 2, 2, HR); R(null, ux - 1, uy - 28, 3, 3, HR); R(null, ux + 2, uy - 26, 2, 2, HR); R(null, ux + 1, uy - 22, 3, 1, HR);
  R(null, ux - 4, uy - 22, 8, 1, '#e63946'); for (let i = 0; i < 5; i++) R(null, ux - 5 - i, uy - 22 + Math.round(Math.sin(t * 25 + i)), 1, 1, '#e63946');
  R(null, ux + 1, uy - 20, 1, 2, '#1a2a50'); R(null, ux + 2, uy - 20, 1, 1, '#7ad7ff'); R(null, ux + 1, uy - 18, 2, 1, '#b5694c');
  R(null, ux + 3, uy - 15, 3, 3, CT); R(null, ux + 3, uy - 15, 3, 1, CH); R(null, ux + 4, uy - 13, 3, 2, '#eef0fa');
  R(null, ux - 6, uy - 15, 2, 3, CS); R(null, ux - 6, uy - 13, 2, 2, '#1b1426');
  if (sw >= 0 && sw < .75) {
    if (P.cb !== 1) trail(hx, hy, wa, 1, 16, 1, '#bfe3ff');
    if (P.cb === 1) trail(hx, hy, ba, 1, 18, 2, '#a24bff');
    if (P.cb === 2) trail(hx, hy, ba, -1, 18, 2, '#a24bff');
  }
  if (bw) kSword(hx, hy, ba);
  wSword(hx, hy, wa);
  if (P.cast >= 0) { const r = 4 + P.cast * 14;
    for (let k = 0; k < 20; k++) R(null, ux + 5 + Math.cos(k * .314 + t * 6) * r, uy - 28 + Math.sin(k * .314 + t * 6) * r * .6, 2, 2, k % 2 ? '#ff3b1f' : '#ffb347');
    if (random() < .6) parts.push({ x: P.x + P.face * 5 + random(-8, 8), y: uy - 8, vx: 0, vy: -30, l: .5, m: .5, c: '#ff9a1f', s: 1, g: 0 }); }
  pop();
}

function melee() { if (P.sw >= 0 || P.cast >= 0) return; P.cb = P.cbT > 0 ? (P.cb + 1) % 3 : 0; P.sw = 0; P.hit = false; P.cbT = .82; sfx('swing'); P.x = constrain(P.x + P.face * (P.cb === 2 ? 5 : 3), 6, st === 'nb' ? 184 : 128); }
function cast() { if (P.sw >= 0 || P.cast >= 0 || P.en < P.cc) return; P.en -= P.cc; P.cast = 0; P.casted = false; sfx('phx'); }
function hurtBoss(d, x, y, cols, big) {
  sfx(big ? 'boom' : 'hit'); const dealt = Math.max(1, Math.round(d * (B.form === 'shield' && B.phase === 2 ? .28 : 1))); B.hp = Math.max(0, B.hp - dealt); B.fl = .12; hst = big ? .1 : .05; sh = big ? 4 : 2;
  burst(x, y, big ? 90 : 14, cols, big ? 90 : 60); pops.push({ x, y: y - 6, t: 0, s: dealt + '' });
}
function strike() {
  if (st === 'nb') return strikeNB();
  if ((B.x - P.x) * P.face < -4 || Math.abs(B.x - P.x) > 34) return;
  const d = Math.round(P.atk * (1 + (P.weaponPct || 0)) * P.mm * [1, 1.7, 2.8][P.cb]);
  hurtBoss(d, B.x - P.face * 12, P.y - 14, P.cb === 1 ? ['#a24bff', '#e0b0ff'] : ['#ffffff', '#bfe3ff', '#ffe36a'], false);
  P.en = Math.min(P.men, P.en + 3 + P.ec); P.hp = Math.min(P.mhp, P.hp + P.ls);
}
function updBattle(dt) {
  const L = keyIsDown(65) || keyIsDown(LEFT_ARROW), Rr = keyIsDown(68) || keyIsDown(RIGHT_ARROW), busy = P.sw >= 0 || P.cast >= 0;
  P.mv = Rr - L; if (P.mv && P.sw < 0 && P.cast < 0) P.face = P.mv;
  // 戰鬥空檔自動面向最近敵人，避免敵人繞到背後時仍朝錯方向揮砍
  if (st === 'nb' && !P.mv && P.sw < 0 && P.cast < 0) { let near = null, nd = 72; for (const e of En) if (e.st <= 0 && Math.abs(e.x - P.x) < nd) { near = e; nd = Math.abs(e.x - P.x); } if (near) P.face = near.x < P.x ? -1 : 1; } P.x = constrain(P.x + P.mv * (busy ? 20 : 68 * (1 + P.spd)) * dt, 6, st === 'nb' ? 184 : 128);
  P.vy += 420 * dt; P.y += P.vy * dt; if (P.y >= GY) { P.y = GY; P.vy = 0; }
  P.en = Math.min(P.men, P.en + (4 + P.er) * dt);
  P.inv = Math.max(0, P.inv - dt); P.nh += dt; if (P.nh > 3 && P.def < P.dmax) P.def = Math.min(P.dmax, P.def + 2 * dt);
  if (st === 'battle') updBoss(dt);
  if (P.sw >= 0) { P.sw += dt / .3; if (P.sw >= .5 && !P.hit) { P.hit = true; strike(); } if (P.sw >= 1) P.sw = -1; }
  else P.cbT = Math.max(0, P.cbT - dt);
  if (P.cast >= 0) { P.cast += dt / .7;
    if (P.cast >= .5 && !P.casted) { P.casted = true; const fd = P.face || 1; proj.push({ x: P.x + 16 * fd, y: P.y - 18, vx: 90 * fd, dir: fd, t: 0, hit: [], dmg: 1 }); burst(P.x + 16 * fd, P.y - 18, 30, ['#ff3b1f', '#ff9a1f', '#ffe36a'], 70); sh = 2; }
    if (P.cast >= 1) P.cast = -1; }
  for (let i = proj.length - 1; i >= 0; i--) { const p = proj[i]; p.t += dt; p.vx = Math.min(260, Math.abs(p.vx) + 280 * dt) * p.dir; p.x += p.vx * dt; p.y += (phY(p) - p.y) * 3 * dt;
    for (let k = 0; k < 5; k++) parts.push({ x: p.x - 10 * p.dir + random(-3, 2), y: p.y + random(-5, 5), vx: random(-35, -8) * p.dir, vy: random(-14, 8), l: .55, m: .55, c: random(['#ff3b1f', '#ff9a1f', '#ffe36a', '#c4220f']), s: random() < .5 ? 2 : 1, g: -12 });
    (p.h = p.h || []).push({ x: p.x, y: p.y }); if (p.h.length > 6) p.h.shift();
    const d8 = Math.round(P.atk * (1 + (P.weaponPct || 0)) * 11 * P.pm + 18 + (P.fireDmg || 0)), fx = p.x + 8 * p.dir;
    if (st === 'nb') { for (const e of En) if (e.st <= 0 && !p.hit.includes(e) && Math.abs(fx - e.x) < e.w / 2 + 8 && Math.abs(p.y - (e.y - e.h / 2)) < e.h / 2 + 10) phHit(p, e, d8); }
    else if (!p.hb && (B.x - p.x) * p.dir <= 29 && (B.x - p.x) * p.dir > -17) { p.hb = true; if (P.burnDmg > 0) { B.burn = 3; B.burnTick = 0; } hurtBoss(d8, B.x - 17 * p.dir, p.y, ['#ff3b1f', '#ff9a1f', '#ffe36a', '#ffffff'], true); }
    if (p.x > W + 28 || p.x < -28) proj.splice(i, 1); }
  if (st === 'nb') updEnemies(dt);
  if (st === 'battle' && random() < dt * 6) parts.push({ x: B.x + random(-18, 18), y: B.y + 18, vx: 0, vy: -14, l: 1, m: 1, c: '#c58aff', s: 1, g: 0 });
  if (st === 'battle' && B.hp <= 0) { st = 'end'; Bl = []; endT = 0; hst = .2; sh = 6; burst(B.x, B.y, 120, ['#c58aff', '#a24bff', '#ffffff', '#6a2cc8'], 120); }
}
function feather(sx, sy, a, L, cols) { const n = cols.length; for (let i = 0; i < L; i++) { const w = i < L * .55 ? 2 : 1; R(null, sx + Math.cos(a) * i, sy + Math.sin(a) * i, w, w, cols[Math.min(n - 1, Math.floor(i / L * n))]); } }
function pwing(sx, sy, base, dir, sc, cols, mem, n) {
  const e2 = base + dir * (n - 1) * .17;
  fill(mem); triangle(sx, sy, sx + Math.cos(base) * 19 * sc, sy + Math.sin(base) * 19 * sc, sx + Math.cos(e2) * 11 * sc, sy + Math.sin(e2) * 11 * sc);
  for (let k = 0; k < n; k++) feather(sx, sy, base + dir * k * .17 + Math.sin(t * 22 + k * .6) * .03, (20 - k * 1.8) * sc, cols);
}
function drawPhoenix(p) {
  const fa = Math.sin(p.t * 22) * .5 + .5, x = Math.floor(p.x), y = Math.floor(p.y), h = p.h || [], dir = p.dir || 1;
  push(); translate(x, y); scale(dir * 1.2, 1.2); translate(-x, -y);
  h.forEach((q, i) => { const lx = x + (q.x - p.x) * dir / 1.2, ly = y + (q.y - p.y) / 1.2; drawingContext.globalAlpha = .05 + i * .03; R(null, lx - 9, ly - 5, 18, 10, '#ff7a1f'); R(null, lx - 3, ly - 8, 8, 3, '#ffb347'); });
  drawingContext.globalAlpha = .16; R(null, x - 20, y - 13, 46, 26, '#ff4a1f'); R(null, x - 11, y - 8, 30, 16, '#ffb347'); drawingContext.globalAlpha = 1;
  noStroke();
  pwing(x - 2, y, 3.0 - fa * 1.4, -1, .8, ['#3a0503', '#6e0d05', '#a81808', '#e8441a', '#ff8a1f', '#ffd24a'], 'rgba(110,13,5,0.55)', 7);
  const pc = ['#7a0d05', '#c4220f', '#ff4a1f', '#ff8a1f', '#ffd24a'];
  for (let i = 0; i < 7; i++) for (let j = 0; j < 11; j++) { const s2 = j < 4 ? 3 : j < 8 ? 2 : 1;
    R(null, x - 8 - j * 3, y + (i - 3) * j * .65 + Math.sin(t * 14 - j * .8 + i) * j * .35, s2, s2, pc[Math.min(4, Math.floor(j / 2.2))]); }
  R(null, x - 8, y - 3, 16, 8, '#a81808'); R(null, x - 7, y - 4, 14, 7, '#e8261a'); R(null, x - 3, y - 1, 9, 4, '#ff8a1f'); R(null, x + 1, y, 5, 2, '#ffd24a');
  for (let k = 0; k < 4; k++) R(null, x - 6 + k * 3, y - 3 + (k % 2), 2, 1, '#ff6a1f');
  drawingContext.globalAlpha = .35 + .2 * Math.sin(p.t * 18); R(null, x - 1, y - 2, 7, 5, '#fff3a0'); drawingContext.globalAlpha = 1;
  R(null, x + 6, y - 7, 5, 6, '#e8261a'); R(null, x + 8, y - 9, 6, 6, '#ff3b1f'); R(null, x + 9, y - 9, 4, 2, '#ff7a1f');
  R(null, x + 11, y - 7, 2, 2, '#ffffff'); R(null, x + 12, y - 7, 1, 1, '#2a0800'); R(null, x + 10, y - 4, 3, 1, '#ffe36a');
  fill('#ffd24a'); triangle(x + 14, y - 7, x + 20, y - 5, x + 14, y - 3); fill('#c98a10'); triangle(x + 14, y - 5, x + 19, y - 5, x + 14, y - 3);
  R(null, x - 1, y + 5, 1, 3, '#ffd24a'); R(null, x + 3, y + 5, 1, 3, '#ffd24a');
  for (let i = 0; i < 3; i++) for (let j = 0; j < 7; j++) { const s2 = j > 3 ? 1 : 2; R(null, x + 9 - j * (.8 + i * .35) + Math.sin(t * 20 + j + i) * .8, y - 9 - j * (1 + i * .1), s2, s2, ['#ff3b1f', '#ff9a1f', '#ffe36a'][Math.min(2, j >> 1)]); }
  pwing(x - 2, y - 3, -3.0 + fa * 1.4, 1, 1, ['#6e0d05', '#b81808', '#ff4a1f', '#ff9a1f', '#ffd24a', '#fff3a0'], 'rgba(184,24,8,0.6)', 8);
  for (let k = 0; k < 4; k++) R(null, x - 12 - random(18), y + random(-9, 9), 1, 1, random(['#ffe36a', '#ff9a1f']));
  pop();
}

// ---------- 魔王: 旋轉的紫色魔方 ----------
// ---------- 魔王第二階段：精緻巨劍 / 盾牌 ----------
const SHD = [[-21,-24],[-9,-27],[0,-24],[9,-27],[21,-24],[22,-2],[17,11],[9,21],[0,28],[-9,21],[-17,11],[-22,-2]];
const SHL = [[0,-24],[-9,-27],[-21,-24],[-22,-2],[-17,11],[-9,21],[0,28]];
const SHR = [[0,-24],[9,-27],[21,-24],[22,-2],[17,11],[9,21],[0,28]];
function shp(pts, s, x, y) { beginShape(); for (const p of pts) vertex(x + p[0] * s, y + p[1] * s); endShape(CLOSE); }

function bossSword(cx, cy, ang, al) {
  const gl = drawingContext.globalAlpha, pu = .5 + .5 * Math.sin(t * 5);
  push(); translate(cx, cy); rotate(ang); noStroke();
  drawingContext.globalAlpha = gl * al;
  // 魔力光暈
  fill(162, 75, 255, 38); ellipse(0, -14, 36, 70);
  fill(210, 150, 255, 34); ellipse(0, -16, 20, 56);
  // 劍刃鋸齒
  fill('#1a0a36');
  for (let k = 0; k < 5; k++) { const y = -30 + k * 7; triangle(6.5, y, 10, y + 3.5, 6.5, y + 7); triangle(-6.5, y, -10, y + 3.5, -6.5, y + 7); }
  // 劍身：暗底 + 左亮右暗兩個斜面
  fill('#241044'); beginShape(); vertex(0,-46); vertex(6.5,-35); vertex(7,6); vertex(-7,6); vertex(-6.5,-35); endShape(CLOSE);
  fill('#7e55d8'); beginShape(); vertex(0,-46); vertex(-6.5,-35); vertex(-7,6); vertex(0,6); endShape(CLOSE);
  fill('#3a1c78'); beginShape(); vertex(0,-46); vertex(6.5,-35); vertex(7,6); vertex(0,6); endShape(CLOSE);
  // 血槽 + 發光中線
  fill('#12062a'); rect(-1.4, -36, 2.8, 41);
  fill(217, 184, 255, 140 + pu * 100); rect(-.5, -36, 1, 41);
  // 刃口高光、劍尖
  stroke('#f4eaff'); strokeWeight(.7); line(-6.3, -34, -6.8, 5); noStroke();
  fill('#ffffff'); triangle(0, -46, 2.2, -39, -2.2, -39);
  // 符文
  for (let k = 0; k < 5; k++) { fill(224, 160, 255, 90 + 150 * Math.max(0, Math.sin(t * 5 + k))); rect(k % 2 ? 2.5 : -5, -30 + k * 7, 2.5, 1.2); }
  // 護手
  fill('#7a5a10'); beginShape(); vertex(-17,5); vertex(-8,3); vertex(8,3); vertex(17,5); vertex(13,11); vertex(4,10); vertex(-4,10); vertex(-13,11); endShape(CLOSE);
  fill('#d9b441'); beginShape(); vertex(-17,5); vertex(-8,3); vertex(8,3); vertex(17,5); vertex(13,8); vertex(-13,8); endShape(CLOSE);
  fill('#ffe58a'); rect(-8, 3, 16, 1.2);
  fill('#d9b441'); triangle(-17, 5, -22, 1, -13, 9); triangle(17, 5, 22, 1, 13, 9);
  // 護手寶石
  fill('#ff2a4a'); ellipse(0, 6.5, 5.5, 5.5); fill('#ffb0b8'); ellipse(-.9, 5.6, 1.8, 1.8);
  // 握柄 + 纏繩
  fill('#2a160e'); rect(-2.3, 10, 4.6, 13);
  fill('#6a3a22'); for (let k = 0; k < 4; k++) rect(-2.3, 11 + k * 3, 4.6, 1.1);
  // 劍首
  fill('#7a5a10'); ellipse(0, 25, 8, 8); fill('#d9b441'); ellipse(0, 24.6, 7, 7);
  fill('#c58aff'); ellipse(0, 24.6, 3.4, 3.4); fill('#fff'); ellipse(-.6, 24, 1, 1);
  drawingContext.globalAlpha = gl; pop();
}

function bossShield(cx, cy) {
  const pu = .5 + .5 * Math.sin(t * 4); noStroke();
  // 能量光暈
  fill(80, 200, 255, 26 + pu * 28); ellipse(cx, cy + 1, 68, 72);
  fill(150, 240, 255, 20); ellipse(cx, cy + 1, 54, 58);
  // 護手尖刺
  fill('#d9b441'); triangle(cx-22, cy-24, cx-27, cy-36, cx-13, cy-26); triangle(cx+22, cy-24, cx+27, cy-36, cx+13, cy-26);
  // 金屬外框（多層）
  fill('#2a1c05'); shp(SHD, 1.13, cx, cy);
  fill('#b88a1e'); shp(SHD, 1.06, cx, cy);
  fill('#f2d46a'); shp(SHD, 1.0, cx - .6, cy - .6);
  fill('#6a4c0c'); shp(SHD, .93, cx, cy);
  // 盾面：左亮右暗 + 內斜面
  fill('#2a7cc4'); shp(SHL, .88, cx, cy); fill('#164a80'); shp(SHR, .88, cx, cy);
  fill('#3c98e0'); shp(SHL, .72, cx, cy); fill('#1d5a9a'); shp(SHR, .72, cx, cy);
  // 十字紋章
  fill('#eaf8ff'); rect(cx - 2.5, cy - 20, 5, 38); rect(cx - 13, cy - 9, 26, 5);
  fill('#8cc4e8'); rect(cx + .5, cy - 20, 2, 38); rect(cx - 13, cy - 5, 26, 1.4);
  // 中央盾心
  fill('#3d5164'); ellipse(cx, cy - 7, 14, 14); fill('#9fb4c8'); ellipse(cx, cy - 7, 11, 11);
  fill('#ffffff'); ellipse(cx - 1.5, cy - 8.5, 3.5, 3.5);
  fill(120, 240, 255, 150 + pu * 100); ellipse(cx, cy - 7, 4.5, 4.5);
  // 鉚釘
  fill('#fff2b0'); for (const p of SHD) ellipse(cx + p[0] * .97, cy + p[1] * .97, 2.2, 2.2);
  // 裂痕與反光
  stroke('#08182c'); strokeWeight(.8);
  line(cx+5, cy+3, cx+9, cy+9); line(cx+9, cy+9, cx+8, cy+15); line(cx+9, cy+9, cx+14, cy+11); line(cx-10, cy+8, cx-6, cy+14);
  noStroke(); fill(255, 255, 255, 42); quad(cx-17, cy-20, cx-9, cy-20, cx-13, cy+4, cx-19, cy+1);
  // 旋轉能量弧
  noFill(); stroke(150, 240, 255, 150); strokeWeight(1.2);
  for (let k = 0; k < 3; k++) arc(cx, cy + 1, 62, 66, t * 2 + k * 2.09, t * 2 + k * 2.09 + .7);
  noStroke();
}
function drawBoss() {
  const cx = B.x, cy = B.y + Math.sin(t * 1.6) * 2;
  if (B.phase === 2) {
    const glow = B.form === 'shield' ? '#45bfff' : '#ff4a6a';
    drawingContext.globalAlpha = .22; fill(glow); ellipse(cx, cy, 48, 48); drawingContext.globalAlpha = 1;
    noStroke();
    if (B.ds === 1) { // 衝撞預警：地面紅帶 + 方向箭頭
      drawingContext.globalAlpha = .14 + .14 * Math.sin(t * 45); R(null, 0, GY - 22, W, 24, '#ff2a4a');
      drawingContext.globalAlpha = .6; fill('#ff6a7a');
      for (let k = 0; k < 6; k++) { const ax = cx + B.dir * (26 + k * 22); triangle(ax, GY - 12, ax - B.dir * 7, GY - 18, ax - B.dir * 7, GY - 6); }
      drawingContext.globalAlpha = 1;
    }
    if (B.form === 'sword') {
      const dsh = B.ds === 1 || B.ds === 2, ang = dsh ? B.dir * 1.45 : -.25 + Math.sin(t * 5) * .08;
      if (B.ds === 2) for (let k = 4; k >= 1; k--) bossSword(cx - B.dir * k * 9, cy + 12, ang, .08 * (5 - k)); // 衝刺殘影
      bossSword(cx, cy + 12, ang, 1);
    } else bossShield(cx, cy);
    for (let k = 0; k < 5; k++) R(null, cx - 18 + k * 9, cy + 29 + Math.sin(t * 8 + k) * 2, 3, 2, '#c58aff');
    return;
  }
  const a = t * .8, b = t * 1.1, c = t * .4, RR = 17, V = [];
  noStroke();
  for (const [r, al] of [[34, 22], [27, 30], [21, 36]]) { if (B.at && B.at.k === 4) fill(255, 70, 50, al + 14); else fill(160, 60, 255, al); ellipse(cx, cy, r * 2 + Math.sin(t * 3) * 3, r * 2 + Math.sin(t * 3) * 3); }
  for (let i = 0; i < 8; i++) {
    const x = i & 1 ? 1 : -1, y = i & 2 ? 1 : -1, z = i & 4 ? 1 : -1;
    const x1 = x * Math.cos(b) + z * Math.sin(b), z1 = -x * Math.sin(b) + z * Math.cos(b);
    const y1 = y * Math.cos(a) - z1 * Math.sin(a), z2 = y * Math.sin(a) + z1 * Math.cos(a);
    V.push([x1 * Math.cos(c) - y1 * Math.sin(c), x1 * Math.sin(c) + y1 * Math.cos(c), z2]);
  }
  const F = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]]
    .map(f => ({ f, z: f.reduce((s, i) => s + V[i][2], 0) / 4 })).sort((p, q) => p.z - q.z);
  for (const { f, z } of F) {
    const br = map(z, -1, 1, .45, 1.15), fl = B.fl > 0 ? 1 : 0, col = [150 * br, 60 * br, 230 * br].map(v => lerp(Math.min(255, v), 255, fl));
    const px = f.map(i => [cx + V[i][0] * RR, cy + V[i][1] * RR]), mx = px.reduce((s, p) => s + p[0], 0) / 4, my = px.reduce((s, p) => s + p[1], 0) / 4;
    fill(col[0], col[1], col[2]); stroke(235, 180, 255, 170 + Math.sin(t * 4) * 60); strokeWeight(1);
    beginShape(); px.forEach(p => vertex(p[0], p[1])); endShape(CLOSE); noStroke();
    fill(Math.min(255, col[0] + 50), Math.min(255, col[1] + 50), 255, 200);
    beginShape(); px.forEach(p => vertex(mx + (p[0] - mx) * .55, my + (p[1] - my) * .55)); endShape(CLOSE);
  }
  for (let k = 0; k < 4; k++) { const an = t * 2 + k * HALF_PI; R(null, cx + Math.cos(an) * 29, cy + Math.sin(an) * 14, 3, 3, '#c58aff'); }
}

// ---------- 音樂 (Web Audio 合成, 不需要任何音檔) ----------
const mf = n => 440 * Math.pow(2, (n - 69) / 12);
const SG = { // bpm / r=每小節和弦根音 / q=0小調 1大調 / d=鼓型 / L=旋律(16步x4小節, 0=休止)
  hot: { bpm: 160, r: [57, 53, 55, 52], q: [0, 1, 1, 1], d: 0, L: [[81,0,84,0,86,0,84,81,83,0,81,0,79,0,76,0],[77,0,81,0,84,0,81,77,79,0,77,0,76,0,72,0],[79,0,83,0,86,0,83,79,81,0,79,0,77,0,74,0],[76,0,80,0,83,0,80,76,81,83,84,0,83,0,80,0]] },
  battle: { bpm: 176, r: [50, 46, 48, 45], q: [0, 1, 1, 1], d: 1, L: [[74,0,77,81,86,0,81,77,74,0,77,0,81,0,79,77],[70,0,74,77,82,0,77,74,70,0,74,0,77,0,74,70],[72,0,76,79,84,0,79,76,72,0,76,0,79,0,76,72],[69,0,73,76,81,0,76,73,81,0,84,0,85,84,81,0]] },
  ult: { bpm: 196, r: [47, 43, 45, 42], q: [0, 1, 1, 1], d: 2, L: null },
  mys: { bpm: 84, r: [45, 41, 43, 40], q: [0, 1, 1, 1], d: 3, L: null },
  title: { bpm: 104, r: [57, 53, 55, 52], q: [0, 1, 1, 1], d: 4, L: [[81,0,0,0,84,0,0,0,88,0,0,0,86,0,84,0],[84,0,0,0,81,0,0,0,89,0,0,0,88,0,84,0],[83,0,0,0,86,0,0,0,91,0,0,0,88,0,86,0],[88,0,0,0,84,0,83,0,80,0,83,0,88,0,0,0]] }
};
function aud() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); const c = AC.createDynamicsCompressor(); MG = AC.createGain(); MG.gain.value = MUTE ? 0 : .35;
    MG.connect(c); c.connect(AC.destination); nxt = AC.currentTime + .1; setInterval(schedule, 40); } catch (e) { AC = null; } }
  if (AC && AC.state === 'suspended') AC.resume();
}
function tone(f, t0, d, type, v, sl) {
  const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0); if (sl) o.frequency.exponentialRampToValueAtTime(sl, t0 + d);
  g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d); o.connect(g); g.connect(MG); o.start(t0); o.stop(t0 + d + .02);
}
function nz(t0, d, v, hp) {
  if (!NBUF) { NBUF = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const a = NBUF.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; }
  const s2 = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter(); s2.buffer = NBUF; f.type = 'highpass'; f.frequency.value = hp;
  g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d); s2.connect(f); f.connect(g); g.connect(MG); s2.start(t0); s2.stop(t0 + d + .02);
}
function playStep(n, s2, t0) {
  const S2 = SG[n], bar = Math.floor(s2 / 16) % 4, k = s2 % 16, r = S2.r[bar], T = [[0, 3, 7], [0, 4, 7]][S2.q[bar]], sd = 60 / S2.bpm / 4;
  if (n === 'mys') { // 神秘: 低音鋪底 + 稀疏鈴聲 + 心跳
    if (k === 0) { tone(mf(r - 12), t0, sd * 15, 'triangle', .2); tone(mf(r), t0, sd * 15, 'sine', .1); tone(mf(r + 7), t0, sd * 15, 'sine', .06); }
    if (k % 2 === 0) { const i = (s2 * 7 + bar * 3) % 5; tone(mf(r + 24 + T[i % 3] + (i > 2 ? 12 : 0)), t0, sd * 5, 'sine', .07); }
    if (k === 0 || k === 6) tone(70, t0, .25, 'sine', .3, 35);
    if (k === 8 && bar % 2) tone(mf(r + 25), t0, sd * 7, 'sine', .035);
    return;
  }
  if (n === 'title') { // 史詩: 低音鋪底 + 慢速鈴琴 + 戰鼓
    if (k === 0) { tone(mf(r - 12), t0, sd * 15, 'triangle', .22); tone(mf(r), t0, sd * 15, 'sawtooth', .025); tone(mf(r + T[1]), t0, sd * 15, 'sawtooth', .02); }
    if (k % 2 === 0) tone(mf(r + 12 + T[(k >> 1) % 3]), t0, sd * 1.6, 'triangle', .07);
    const tl = S2.L[bar][k]; if (tl) tone(mf(tl), t0, sd * 3.8, 'square', .075);
    if (k === 0 || k === 8) tone(110, t0, .3, 'sine', .55, 35);
    if (k === 12) { nz(t0, .18, .22, 1200); tone(180, t0, .1, 'triangle', .15); }
    if (bar === 3 && k >= 10 && k % 2 === 0) nz(t0, .08, .16, 1800);
    return;
  }
  if (k % 2 === 0) tone(mf(r - 12 + (k % 4 === 2 ? 12 : 0)), t0, sd * 1.8, 'triangle', .22);
  tone(mf(r + 12 + T[[0, 1, 2, 1][k % 4]]), t0, sd * .9, 'square', .045);
  const ln = S2.L ? S2.L[bar][k] : r + 24 + T[[0, 1, 2, 1, 0, 1, 2, 0, 2, 1, 0, 1, 2, 0, 2, 1][k]];
  if (ln) tone(mf(ln), t0, sd * 1.9, 'square', .09);
  const d = S2.d, kick = d === 0 ? k % 4 === 0 : d === 1 ? [0, 4, 8, 10, 12].includes(k) : k % 2 === 0;
  if (kick) tone(150, t0, .12, 'sine', .45, 40);
  if (k === 4 || k === 12 || (d === 2 && bar === 3 && k > 13)) { nz(t0, .1, .22, 1500); tone(190, t0, .07, 'triangle', .15); }
  if (d === 0 ? k % 2 === 0 : true) nz(t0, .03, d === 0 ? .06 : .035, 6000);
}
function schedule() { if (!AC || !MC) return; const sd = 60 / (SG[MC].bpm * (MC === 'hot' && st === 'mini' ? 1 + mi * .03 : 1)) / 4; while (nxt < AC.currentTime + .25) { playStep(MC, stp, Math.max(nxt, AC.currentTime)); nxt += sd; stp++; } }
function mus(n) { if (n === MC) return; MC = n; stp = 0; if (AC) nxt = AC.currentTime + .05; }
function musWant() { return st === 'title' ? 'title' : MYS ? 'mys' : (st === 'battle' || st === 'end' || st === 'lose') ? (B.at && B.at.k === 4 ? 'ult' : 'battle') : 'hot'; }
function sfx(n) {
  if (!AC || MUTE) return; const t0 = AC.currentTime;
  if (n === 'hit') { tone(220, t0, .08, 'square', .18, 90); nz(t0, .06, .15, 2000); }
  if (n === 'swing') nz(t0, .09, .1, 4000);
  if (n === 'phx') { tone(300, t0, .4, 'sawtooth', .13, 1000); tone(150, t0, .4, 'square', .08, 500); }
  if (n === 'boom') { nz(t0, .4, .3, 300); tone(120, t0, .35, 'sine', .4, 30); }
  if (n === 'good') { tone(660, t0, .1, 'square', .12); tone(990, t0 + .09, .18, 'square', .12); }
  if (n === 'bad') tone(180, t0, .25, 'sawtooth', .13, 90);
  if (n === 'hurt') { tone(260, t0, .22, 'sawtooth', .16, 70); nz(t0, .12, .15, 800); }
  if (n === 'kill') tone(500, t0, .15, 'square', .12, 150);
  if (n === 'pick') [523, 659, 784, 1047].forEach((f, i) => tone(f, t0 + i * .07, .14, 'square', .1));
  if (n === 'tick') tone(1200, t0, .05, 'square', .07);
  if (n === 'tele') { tone(100, t0, .7, 'sine', .22, 1200); nz(t0, .5, .08, 3000); }
}

// ---------- 奇物 ----------
const RELIC = [
  { n: '利息卡', d: '進入每個節點 +5 金幣', node: () => { P.coins += 5; return '+5 金幣'; } },
  { n: '啞鈴', d: '進入每個節點 +3 攻擊', node: () => { P.atk += 3; return '+3 攻擊'; } },
  { n: '烤肉串', d: '最大生命 +5 並回復 5', on: () => { P.mhp += 5; P.hp += 5; } },
  { n: '能量電池', d: '能量上限 +20，進入節點 +10 能量', on: () => { P.men += 20; }, node: () => { P.en = Math.min(P.men, P.en + 10); return '+10 能量'; } },
  { n: '護盾水晶', d: '護盾上限 +8', on: () => { P.dmax += 8; P.def += 8; } },
  { n: '鳳凰羽', d: '火鳳凰傷害 +30%', on: () => { P.pm += .3; } },
  { n: '吸血獠牙', d: '普攻命中回復 1 生命', on: () => { P.ls += 1; } },
  { n: '幸運硬幣', d: '答錯的獎勵損失降為 -50%', on: () => { P.pen = .5; } },
  { n: '黑曜護符', d: '受傷後無敵時間 +0.5 秒', on: () => { P.invT += .5; } },
  { n: '煉金燈', d: '進入每個節點 +3 護盾', node: () => { P.dmax += 3; P.def += 3; return '+3 護盾'; } },
  { n: '鋼盔', d: '護盾上限 +12', on: () => { P.dmax += 12; P.def += 12; } },
  { n: '熱血咖啡', d: '能量每秒多回復 2 點', on: () => { P.er += 2; } },
  { n: '火焰之心', d: '火鳳凰消耗 -10 能量', on: () => { P.cc = Math.max(10, P.cc - 10); } },
  { n: '狂戰士護腕', d: '普攻傷害 +25%', on: () => { P.mm += .25; } },
  { n: '錢袋', d: '立刻獲得 20 金幣', on: () => { P.coins += 20; } },
  { n: '聖水', d: '進入每個節點回復 8 生命', node: () => { P.hp = Math.min(P.mhp, P.hp + 8); return '+8 生命'; } },
  { n: '黃金鎧', d: '每次受到傷害 -2', on: () => { P.dr += 2; } },
  { n: '疾風靴', d: '移動速度 +20%', on: () => { P.spd += .2; } },
  { n: '魔方鏡片', d: '魔王終結技衝能變慢 40%', on: () => { P.sl = Math.min(.8, P.sl + .4); } },
  { n: '連擊手套', d: '普攻命中多回復 2 能量', on: () => { P.ec += 2; } },
  { n: '復活羽毛', d: '死亡時復活一次（回復一半生命）', on: () => { P.rev += 1; } },
  { n: '小錢罐', d: '擊敗小怪 +1 金幣', on: () => { P.ck += 1; } },
  { n: '龍之心', d: '最大生命 +25，立即回復 25', on: () => { P.mhp += 25; P.hp = Math.min(P.mhp, P.hp + 25); } },
  { n: '時之沙漏', d: '移動速度 +35%，能量回復 +2/秒', on: () => { P.spd += .35; P.er += 2; } },
  { n: '赤焰核心', d: '火鳳凰傷害再 +50%', on: () => { P.pm += .5; } },
  { n: '亡者硬幣', d: '擊殺敵人回復 3 生命', on: () => { P.kh = (P.kh || 0) + 3; } },
  { n: '星界護盾', d: '護盾上限 +20，立即補滿新增護盾', on: () => { P.dmax += 20; P.def += 20; } },
  { n: '貪婪寶石', d: '每次進入節點獲得 8 金幣', node: () => { P.coins += 8; return '+8 金幣'; } },
  { n: '戰意徽章', d: '普攻傷害 +40%', on: () => { P.mm += .4; } }
];
function openRelic() {
  st = 'mini'; const pool = RELIC.map((r, i) => i).filter(i => !P.rel.includes(i)).sort(() => random() - .5).slice(0, 3);
  if (!pool.length) { nextNode(); return; }
  M = { kind: 'r', o: pool, ph: 1, pt: 0, sel: -1 }; sfx('pick');
}
function drawRelic() {
  tx('獲得奇物！選擇一個', 384, 100, 44, '#ffd24a');
  M.o.forEach((ri, k) => { const r = RELIC[ri], on = M.ph === 2 && M.sel === k;
    fill(on ? '#2f8f55' : '#2a2550'); rect(74, 150 + k * 92, 620, 80, 12);
    tx(`${k + 1}. ${r.n}`, 100, 178 + k * 92, 28, '#ffd24a', LEFT); tx(r.d, 100, 212 + k * 92, 20, '#fff', LEFT); });
  if (M.ph === 2) tx(`獲得「${RELIC[M.o[M.sel]].n}」`, 384, 424, 24, '#7dff9a');
}

// ---------- 神秘空間 ----------
function initStars() { for (let i = 0; i < 110; i++) STARS.push({ x: Math.random() * W, y: Math.random() * 52, v: .8 + Math.random() * 4, ph: Math.random() * 6.28, tw: 1 + Math.random() * 2.5, sz: Math.random() < .12 ? 2 : 1 }); }
function mkEye() {
  const hw = 62, hh = 24, cx = 65, cy = 35, TH = [.3, .5, .7, .88], SC = ['#a30e1a', '#7c0914', '#560610', '#38040b', '#1f0308'];
  const top = x => Math.floor(hh * (1 - (x / hw) * (x / hw)));
  eyeG = mkG(130, 70, g => {
    for (let x = -hw; x <= hw; x++) { const tp = top(x);
      for (let y = -tp; y <= tp; y++) { const d = Math.hypot(x / hw, y / hh); let c = SC[TH.filter(v => d > v).length], e = tp - Math.abs(y);
        if (e <= 1) c = '#d82032'; else if (e <= 2) c = '#8a0c1a'; R(g, cx + x, cy + y, 1, 1, c); } }
    for (let i = 0; i < 40; i++) { const a = hs(i * 7.7) * TWO_PI;
      for (let s2 = 0; s2 < 18; s2++) { const rr = .98 - s2 * .032, px = Math.round(Math.cos(a) * rr * hw + Math.sin(s2 * .9 + i) * 1.2), py = Math.round(Math.sin(a) * rr * hh * .95);
        if (Math.abs(py) <= top(px)) R(g, cx + px, cy + py, 1, 1, '#c0182a'); } }
    for (let x = -hw; x <= hw; x++) { const tp = top(x); R(g, cx + x, cy - tp - 3, 1, 1, '#3a0610'); R(g, cx + x, cy - tp - 6, 1, 1, '#1c0309'); R(g, cx + x, cy + tp + 3, 1, 1, '#2a0409');
      if (x % 5 === 0) for (let k = 0; k < 2 + Math.floor(hs(x) * 3); k++) R(g, cx + x, cy - tp - 1 - k, 1, 1, '#0a0102'); }
  });
  irisG = mkG(40, 40, g => { for (let dy = -19; dy <= 19; dy++) for (let dx = -19; dx <= 19; dx++) { const d = Math.hypot(dx, dy); if (d > 19) continue;
    const ai = Math.floor((Math.atan2(dy, dx) + Math.PI) / (TWO_PI / 56)); let c = d > 17 ? '#2a0000' : d > 14 ? '#7a0808' : d > 9 ? '#d01818' : '#ff4a22';
    if (d > 6 && d <= 17 && hs(ai * 3.3) > .62) c = d > 12 ? '#e63a2a' : '#ff8a4a'; if (d < 6) c = '#ff7a3a'; R(g, 20 + dx, 20 + dy, 1, 1, c); } });
}
function drawMystic(rdt) {
  R(null, 0, 0, W, H, '#020004');
  for (let y = 0; y < 54; y += 6) { drawingContext.globalAlpha = y / 54 * .6; R(null, 0, y, W, 6, '#1a0a2e'); } drawingContext.globalAlpha = 1;
  for (const [r, a] of [[190, 9], [140, 13], [105, 17]]) { fill(255, 20, 20, a * (.75 + .25 * Math.sin(t * 1.7))); ellipse(96, 36, r, r * .42); }
  const bp = t % 7.5, open = bp > 7.1 ? Math.max(.06, Math.abs(1 - 2 * (bp - 7.1) / .4)) : 1;
  const ix = Math.round(constrain((P.x - 96) / 9, -11, 11) + Math.sin(t * 3) * .7), iy = Math.round(constrain((P.y - 40) / 10, -2, 2));
  push(); translate(96, 36); scale(1, open);
  image(eyeG, -65, -35); image(irisG, ix - 20, iy - 20);
  for (let dy = -14; dy <= 14; dy++) { const hw = Math.max(1, Math.round(4 * Math.pow(1 - Math.abs(dy) / 15, .6) * (1 + .25 * Math.sin(t * 2)))); R(null, ix - hw, iy + dy, hw * 2, 1, '#050000'); }
  R(null, ix - 8, iy - 9, 3, 3, '#fff6e0'); R(null, ix + 5, iy + 5, 2, 2, '#ffb0a0');
  pop();
  for (let i = 0; i < 8; i++) { const x = mod(i * 41 - t * (3 + i % 3 * 2), W + 90) - 45; fill(6, 2, 12, 120 + (i % 3) * 25); ellipse(x, 18 + i * 5.5, 80 + i * 6, 8 + i % 3 * 3); }
  for (const s2 of STARS) { s2.x -= s2.v * rdt; if (s2.x < -2) s2.x += W + 4; const y = s2.y + Math.sin(t * .6 + s2.ph) * 2, br = .45 + .55 * Math.sin(t * s2.tw + s2.ph);
    drawingContext.globalAlpha = Math.max(.1, br); R(null, s2.x, y, s2.sz, s2.sz, '#ffffff');
    if (s2.sz > 1) { drawingContext.globalAlpha = br * .5; R(null, s2.x - 1, y + .5, 4, 1, '#cfd8ff'); R(null, s2.x + .5, y - 1, 1, 4, '#cfd8ff'); } }
  drawingContext.globalAlpha = 1;
  R(null, 0, 54, W, 1, '#6a3fb0'); R(null, 0, 55, W, 2, '#2a1650'); R(null, 0, 57, W, H - 57, '#07040f');
  for (let i = 0; i < 26; i++) { drawingContext.globalAlpha = (.4 + .6 * Math.sin(t * 2 + i)) * .7; R(null, hs(i * 9.1) * W, 58 + Math.floor(hs(i * 3.7) * 14), 1 + Math.floor(hs(i * 5) * 3), 1, '#9a5aff'); }
  drawingContext.globalAlpha = 1; fill(40, 10, 70, 40); ellipse(96 + Math.sin(t * .4) * 20, 57, 220, 8);
}

// ---------- 戰鬥節點: 小怪 / 煙霧小 boss ----------
function mkEn(tp, d) { const b = tp === 'b'; return { tp, x: random(60, 182), y: b ? 44 : GY, w: b ? 22 : 10, h: b ? 20 : 10, hp: b ? 720 : 95, mhp: b ? 720 : 95, v: b ? 38 : random(18, 31), d: random() < .5 ? -1 : 1, dt: random(.4, 1.5), f: 0, ph: random(TWO_PI), dash: 0, dcd: 3, st: d }; }
function startNB(h) {
  MYS = true; FD = 1; M = null; st = 'nb'; nbT = 0; proj = []; parts = []; Bl = []; P.x = 30; P.y = GY; P.vy = 0; P.sw = -1; P.cast = -1; P.inv = 0; P.face = 1;
  P.en = Math.min(P.men, P.en + 30); burst(P.x, P.y - 10, 50, ['#c58aff', '#ffffff', '#7a3cff'], 80); sfx('tele');
  const n = 5 + floor(random(6)); En = []; for (let i = 0; i < n; i++) En.push(mkEn('m', i * .12)); if (h) En.push(mkEn('b', 1.2));
  BN = h ? '困難戰鬥！' : '普通戰鬥！'; bannerT = 1.6;
}
function phY(p) { if (st !== 'nb') return (B.x - p.x) * p.dir > 0 ? B.y : p.y; let b = null; for (const e of En) if (e.st <= 0 && !p.hit.includes(e) && (e.x - p.x) * p.dir > -6 && (!b || Math.abs(e.x - p.x) < Math.abs(b.x - p.x))) b = e; return b ? b.y - b.h / 2 : p.y; }
function strikeNB() {
  const d = Math.round(P.atk * (1 + (P.weaponPct || 0)) * P.mm * [1, 1.7, 2.8][P.cb]); let n = 0;
  for (const e of En) { if (e.st > 0) continue; const dx = (e.x - P.x) * P.face;
    if (dx > -6 && dx < 30 + e.w / 2 && Math.abs((e.y - e.h / 2) - (P.y - 12)) < e.h / 2 + 13) { e.hp -= d; e.f = .12; e.x += P.face * (P.cb === 2 ? 7 : 3); n++;
      pops.push({ x: e.x, y: e.y - e.h - 6, t: 0, s: d + '' }); burst(e.x, e.y - e.h / 2, 10, P.cb === 1 ? ['#a24bff', '#e0b0ff'] : ['#ffffff', '#bfe3ff', '#ffe36a'], 55); } }
  if (n) { hst = .05; sh = 1.5; P.en = Math.min(P.men, P.en + 3 + P.ec); P.hp = Math.min(P.mhp, P.hp + P.ls); sfx('hit'); }
}
function phHit(p, e, d) { p.hit.push(e); e.hp -= d; if (P.burnDmg > 0) { e.burn = Math.max(e.burn || 0, 3); e.burnTick = 0; } e.f = .15; e.x += p.dir * 5; hst = .06; sh = 3; sfx('boom'); pops.push({ x: e.x, y: e.y - e.h - 6, t: 0, s: d + '' }); burst(e.x, e.y - e.h / 2, 40, ['#ff3b1f', '#ff9a1f', '#ffe36a', '#ffffff'], 80); }
function aoe(x, y) {
  const d = Math.round(P.atk * 4 * P.pm); hst = .1; sh = 4; sfx('boom'); burst(x, y, 90, ['#ff3b1f', '#ff9a1f', '#ffe36a', '#ffffff'], 90);
  for (const e of En) if (e.st <= 0 && Math.hypot(e.x - x, e.y - e.h / 2 - y) < 28) { e.hp -= d; e.f = .15; pops.push({ x: e.x, y: e.y - e.h - 6, t: 0, s: d + '' }); }
}
function updEnemies(dt) {
  for (let i = En.length - 1; i >= 0; i--) { const e = En[i];
    if (e.st > 0) { e.st -= dt; if (e.st <= 0) burst(e.x, e.y - 6, 18, ['#c58aff', '#7a3cff', '#ffffff'], 50); continue; }
    e.f = Math.max(0, e.f - dt); e.ph += dt * 6; e.dt -= dt; if (e.burn > 0) { e.burn -= dt; e.burnTick = (e.burnTick || 0) + dt; if (e.burnTick >= .5) { e.burnTick = 0; e.hp -= P.burnDmg; pops.push({ x:e.x, y:e.y-e.h-5, t:0, s:'灼燒 '+P.burnDmg, c:'#ff9a1f' }); } }
    if (e.dt <= 0) { e.dt = random(.8, 2.2); e.d = random() < .65 ? (Math.sign(P.x - e.x) || 1) : (random() < .5 ? -1 : 1); }
    let sp = e.v;
    if (e.tp === 'b') { e.dcd -= dt; if (e.dcd <= 0) { e.dcd = random(3, 4.5); e.dash = .5; e.d = Math.sign(P.x - e.x) || 1; } if (e.dash > 0) { e.dash -= dt; sp = 110; } e.y = 44 + Math.sin(e.ph * .5) * 8;
      if (dt > 0) for (let k = 0; k < 2; k++) parts.push({ x: e.x + random(-13, 13), y: e.y - e.h / 2 + random(-11, 11), vx: random(-12, 12), vy: random(-28, -8), l: .9, m: .9, c: random(['#1c1030', '#2e1a50', '#0a0612', '#5a3a9a']), s: random() < .4 ? 3 : 2, g: 0 }); }
    e.x += e.d * sp * dt; if (e.x < 8) { e.x = 8; e.d = 1; } if (e.x > 184) { e.x = 184; e.d = -1; }
    if (P.inv <= 0 && Math.abs(e.x - P.x) < e.w / 2 + 3 && Math.abs((e.y - e.h / 2) - (P.y - 10)) < e.h / 2 + 9) hitPlayer(e.tp === 'b' ? 30 : 18);
    if (e.hp <= 0) { const b = e.tp === 'b'; burst(e.x, e.y - e.h / 2, b ? 100 : 24, b ? ['#1c1030', '#5a3a9a', '#c58aff', '#0a0612'] : ['#7a3cff', '#c58aff', '#ff3a3a'], b ? 100 : 60); sfx('kill'); P.coins += P.ck; P.hp = Math.min(P.mhp, P.hp + (P.kh || 0)); if (b) { sh = 5; hst = .12; } En.splice(i, 1); }
  }
  if (st === 'nb' && !En.length) { nbT += dt; if (nbT > 1.4) openRelic(); }
}
function drawEnemies() {
  for (const e of En) { if (e.st > 0) continue; if (e.tp === 'b') drawSmoke(e); else drawImp(e);
    const bw = e.tp === 'b' ? 28 : 12, by = e.tp === 'b' ? e.y - e.h - 8 : e.y - 16, x = Math.floor(e.x - bw / 2);
    R(null, x - 1, by - 1, bw + 2, 4, '#0a0610'); R(null, x, by, bw, 2, '#3a1020'); R(null, x, by, Math.max(0, bw * e.hp / e.mhp), 2, '#e8445a'); R(null, x, by, Math.max(0, bw * e.hp / e.mhp), 1, '#ff8a98'); }
}
function drawImp(e) {
  const x = Math.floor(e.x), y = Math.floor(e.y), bob = Math.round(Math.sin(e.ph)), f = e.f > 0, a = f ? '#ffffff' : '#2a1346', b = f ? '#ffffff' : '#4a2380', c = f ? '#ffffff' : '#120820', d = e.d;
  R(null, x - 5, y - 8 + bob, 10, 7, a); R(null, x - 4, y - 9 + bob, 8, 1, a); R(null, x - 6, y - 6 + bob, 1, 4, a); R(null, x + 5, y - 6 + bob, 1, 4, a);
  R(null, x - 5, y - 8 + bob, 4, 2, b); R(null, x - 5, y - 4 + bob, 10, 2, c);
  R(null, x - 5, y - 11 + bob, 1, 3, c); R(null, x - 4, y - 12 + bob, 1, 2, c); R(null, x + 4, y - 11 + bob, 1, 3, c); R(null, x + 3, y - 12 + bob, 1, 2, c);
  drawingContext.globalAlpha = .35; R(null, x - 5 + d, y - 8 + bob, 10, 4, '#ff3a3a'); drawingContext.globalAlpha = 1;
  R(null, x - 3 + d, y - 7 + bob, 2, 2, '#ff3a3a'); R(null, x + 1 + d, y - 7 + bob, 2, 2, '#ff3a3a'); R(null, x - 3 + d, y - 7 + bob, 1, 1, '#ffd0d0'); R(null, x + 1 + d, y - 7 + bob, 1, 1, '#ffd0d0');
  for (let k = 0; k < 4; k++) R(null, x - 3 + k * 2, y - 4 + bob, 1, 1, '#d8c8f0');
  const w = Math.floor(e.ph) % 2; R(null, x - 4, y - 1, 2, 1 + w, c); R(null, x + 2, y - 1, 2, 2 - w, c);
}
function drawSmoke(e) {
  const cx = e.x, cy = e.y - e.h / 2;
  for (let i = 0; i < 20; i++) { const a = e.ph * (.5 + hs(i) * .7) + i * 1.9, r = 3 + hs(i * 3) * 9, s2 = 5 + Math.floor(hs(i * 5) * 8);
    drawingContext.globalAlpha = .7; R(null, cx + Math.cos(a) * r * 1.4 - s2 / 2, cy + Math.sin(a * 1.3) * r - s2 / 2, s2, s2, i % 3 ? '#07040d' : '#170a28'); }
  drawingContext.globalAlpha = 1; R(null, cx - 6, cy - 6, 12, 12, '#020104');
  if (e.f > 0) { drawingContext.globalAlpha = .55; R(null, cx - 11, cy - 11, 22, 22, '#c58aff'); drawingContext.globalAlpha = 1; }
}

// ---------- 事件結算 / 緊張氛圍 ----------
function evPick(o) {
  if (o.c) P.coins -= o.c; const rl = random(); let c = 0, out = o.r[o.r.length - 1]; for (const z of o.r) { c += z.p; if (rl < c) { out = z; break; } }
  M.res = out.t; M.sum = applyEff(out.e); M.ph = 2; M.pt = 0; sfx(out.e && out.e.hp < 0 ? 'hurt' : 'pick');
}
function evTimeout() { const ok = M.ev.o.filter(o => !o.c || P.coins >= o.c); evPick(random(ok)); M.res = '時間到！命運替你選擇… ' + M.res; }
function tcol() { const r = 1 - M.t / M.T; return r > .5 ? '#46d17a' : r > .25 ? '#ffd24a' : '#ff3a3a'; }
function drawMini() { // 混亂與緊張: 畫面抖動、碎片飄落、時間不足時紅光閃爍
  const tl = M.ph === 1 && M.T ? 1 - M.t / M.T : 1, tn = Math.pow(1 - tl, 2);
  push(); translate(random(-3, 3) * tn, random(-3, 3) * tn);
  drawMini0();
  for (let i = 0; i < 26; i++) { drawingContext.globalAlpha = .12 + .1 * hs(i * 9.3); fill(i % 3 ? '#ff4a6a' : '#9a5aff'); rect(hs(i * 3.1) * 768, mod(hs(i * 7.7) * 452 + t * (50 + hs(i) * 190), 452) - 10, 3 + hs(i * 2) * 5, 3 + hs(i * 5) * 12); }
  drawingContext.globalAlpha = 1; pop();
  if (tl < .35) { drawingContext.globalAlpha = (.35 - tl) * (.6 + .4 * Math.sin(t * 14)); fill('#d01028'); rect(0, 0, 768, 30); rect(0, 402, 768, 30); rect(0, 0, 30, 432); rect(738, 0, 30, 432); drawingContext.globalAlpha = 1; }
}
function titleFx() { // 開幕: 黑幕漸亮 + 閃電
  if (st !== 'title' || TS === 'gate') return;
  const a = Math.max(0, 1 - (TT - .6) / 2.6); if (a > 0) { fill(0, 0, 0, a * 255); rect(0, 0, width, height); }
  if ((TT > 2.35 && TT < 2.5) || (TT > 2.62 && TT < 2.68)) { fill(255, 240, 255, 190); rect(0, 0, width, height); }
}
function titleKey() {
  if (TS === 'open' && TT >= 5.2) TS = 'menu';
  if (TS === 'gate') { TS = 'open'; TT = 0; return; }
  if (TS === 'open') { TT = Math.max(TT, 5.6); return; }
  if (TS === 'intro') { if (keyCode === ENTER || keyCode === ESCAPE || keyCode === BACKSPACE || key === ' ') TS = 'menu'; return; }
  if (key === 'w' || key === 'W' || key === 's' || key === 'S' || keyCode === UP_ARROW || keyCode === DOWN_ARROW) { TSel = 1 - TSel; sfx('tick'); }
  if (keyCode === ENTER || key === ' ') { sfx('pick'); if (TSel === 0) { st = 'mini'; mi = 0; startNode(); } else TS = 'intro'; }
}

// ---------- 彈幕 ----------
const angD = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
function fire(a, sp, tr) { Bl.push({ x: B.x, y: B.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, tr }); }
function ring(n, off, sp, tr, gap) { // gap: 朝玩家附近留一道缺口(越難越小)
  const aim = Math.atan2(P.y - 9 - B.y, P.x - B.x) + random(-.7, .7);
  for (let i = 0; i < n; i++) { const a = off + i * TWO_PI / n; if (gap && angD(a, aim) < gap) continue; fire(a, sp, tr); }
}
function atkStep(dt) {
  const a = B.at, k = a.k, aim = Math.atan2(P.y - 9 - B.y, P.x - B.x); a.t += dt; a.a += dt; a.b += dt;
  if (k === 0 && a.a >= 1.1) { a.a = 0; ring(12, a.n++ % 2 ? .26 : 0, 36, 0, .5); }                       // 簡單: 慢速環形
  if (k === 1 && a.a >= .09) { a.a = 0; a.g += .33; for (let i = 0; i < 3; i++) fire(a.g + i * TWO_PI / 3, 44, 1); } // 普通: 三臂螺旋
  if (k === 2) { if (a.a >= 1) { a.a = 0; ring(20, a.n++ * .16, 42, 2, .3); } if (a.b >= .55) { a.b = 0; for (let i = -2; i <= 2; i++) fire(aim + i * .2, 62, 2); } } // 困難: 環形+瞄準扇形
  if (k === 3) { if (a.a >= .08) { a.a = 0; a.g += .31; fire(a.g, 50, 3); fire(Math.PI - a.g, 50, 3); } if (a.b >= .85) { a.b = 0; ring(26, random(TWO_PI), 48, 3, .14); } } // 超級難: 雙向反轉螺旋+密環
  if (k === 4) { const ph = Math.floor(a.t / 3), arms = ph === 2 ? 5 : 3;                                  // 終結技: 三階段
    if (a.a >= .06) { a.a = 0; a.g += ph === 1 ? .2 : .27; for (let i = 0; i < arms; i++) fire(a.g + i * TWO_PI / arms, ph === 2 ? 46 : 55, 4); }
    if (a.b >= (ph === 1 ? .5 : .7)) { a.b = 0; ring(ph === 1 ? 36 : 30, random(TWO_PI), 42 + ph * 6, 4, .1); if (ph === 1) for (let i = -3; i <= 3; i++) fire(aim + i * .16, 70, 4); } }
  if (a.t >= [4, 4.5, 5, 6, 9][k]) { B.at = null; B.cd = [1.4, 1.2, 1, .9, 2][k]; }
}
function updBoss(dt) {
  if (B.burn > 0) { B.burn -= dt; B.burnTick = (B.burnTick || 0) + dt; if (B.burnTick >= .5) { B.burnTick = 0; B.hp = Math.max(0, B.hp - P.burnDmg); pops.push({x:B.x,y:B.y-20,t:0,s:'灼燒 '+P.burnDmg,c:'#ff9a1f'}); } }
  const phase2 = B.hp <= B.mhp * .5;
  if (phase2 && B.phase !== 2) { B.phase = 2; B.ds = 0; B.combo = false; B.form = 'sword'; B.formT = 1.5; B.dashCd = .8; BN = '魔王第二階段：魔方解體！'; bannerT = 2; sh = 6; burst(B.x, B.y, 70, ['#c58aff','#ff4a6a','#ffffff'], 90); }
  if (B.phase === 2) {
    B.formT -= dt; B.dashCd -= dt; B.touchCd = Math.max(0, B.touchCd - dt);
    if (B.formT <= 0 && !B.ds) { B.form = B.form === 'sword' ? 'shield' : 'sword'; B.formT = B.form === 'shield' ? 2.8 : 2.0; BN = B.form === 'shield' ? '魔王化為盾牌：攻擊被削弱！' : '魔王化為巨劍：衝撞！'; bannerT = 1; }
    if (B.form === 'sword' || B.ds) {
      if (!B.ds && B.dashCd <= 0) { B.ds = 1; B.wt = .65; B.combo = false; B.dir = Math.sign(P.x - B.x) || -1; sfx('tele'); }
      if (B.ds === 1) { // 蓄力預警（顫抖 + 壓低到地面）
        B.wt -= dt; B.x += random(-.5, .5); B.y += (40 - B.y) * Math.min(1, dt * 8);
        if (B.wt <= 0) { B.ds = 2; sh = 3; sfx('boom'); }
      } else if (B.ds === 2) { // 全場衝刺（可穿過玩家，跳起可閃）
        B.x += B.dir * 250 * dt; B.y += (40 - B.y) * Math.min(1, dt * 12);
        for (let k = 0; k < 3; k++) parts.push({ x: B.x - B.dir * random(0, 14), y: B.y + random(-14, 16), vx: -B.dir * random(10, 40), vy: random(-12, 12), l: .4, m: .4, c: random(['#a24bff', '#e0b0ff', '#ff4a6a']), s: random() < .4 ? 2 : 1, g: 0 });
        if (B.touchCd <= 0 && P.inv <= 0 && (P.x - B.x) * B.dir > -14 && (P.x - B.x) * B.dir < 40 && P.y > B.y - 4) {
          B.touchCd = .6; hitPlayer(38); P.x = constrain(P.x + B.dir * 16, 5, 128);
        }
        if ((B.dir > 0 && B.x >= 182) || (B.dir < 0 && B.x <= 8)) {
          B.x = constrain(B.x, 8, 182); sh = 4; sfx('boom'); burst(B.x, B.y + 10, 30, ['#c58aff', '#ffffff', '#ff4a6a'], 80);
          if (!B.combo && random() < .6) { B.combo = true; B.ds = 1; B.wt = .3; B.dir = -B.dir; } // 連擊：反向再衝
          else { B.combo = false; B.ds = 3; B.dashCd = 1.8; }
        }
      } else if (B.ds === 3) { // 回位
        B.x += (158 - B.x) * Math.min(1, dt * 2.5); B.y += (34 - B.y) * Math.min(1, dt * 4);
        if (Math.abs(B.x - 158) < 5) B.ds = 0;
      } else { // 平常：緩慢逼近 + 接觸傷害
        B.x += Math.sign(P.x - B.x) * 13 * dt; B.x = constrain(B.x, Math.min(178, P.x + 12), 178); B.y += (34 - B.y) * Math.min(1, dt * 4);
        if (B.touchCd <= 0 && P.inv <= 0 && Math.abs(B.x - P.x) < 13) { B.touchCd = 1.1; hitPlayer(32); P.x = constrain(P.x + (P.x < B.x ? -1 : 1) * 15, 5, 184); }
      }
    } else { B.x += (158 - B.x) * Math.min(1, dt * .8); B.y += (34 - B.y) * Math.min(1, dt * 4); }
  }
  if (!(B.at && B.at.k === 4)) B.ch = Math.min(100, B.ch + dt * (1 - P.sl));
  if (!B.at) {
    B.cd -= dt;
    if (B.ch >= 100) { B.at = { k: 4, t: 0, a: 0, b: 0, n: 0, g: 0 }; B.ch = 0; BN = '終結技！'; bannerT = 1.4; sh = 4; }
    else if (B.cd <= 0) { const tr = Math.min(3, Math.floor((1 - B.hp / B.mhp) * 4)); let k = random() < .5 ? tr : Math.max(0, tr - 1); if (B.phase === 2 && k !== 0) k = 0; B.at = { k, t: 0, a: 0, b: 0, n: 0, g: random(TWO_PI) }; }
  } else atkStep(dt);
  for (let i = Bl.length - 1; i >= 0; i--) { const b = Bl[i]; b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < -6 || b.x > W + 6 || b.y < -6 || b.y > 57) { Bl.splice(i, 1); continue; }
    if (P.inv <= 0 && Math.abs(b.x - P.x) < 3.5 && Math.abs(b.y - (P.y - 9)) < 7.5) { hitPlayer(BD[b.tr]); Bl.splice(i, 1); } }
}

function hitPlayer(d) {
  d = Math.max(1, d - P.dr);
  P.inv = P.invT; sfx('hurt'); P.nh = 0; const ab = Math.min(P.def, d); P.def -= ab; P.hp -= d - ab; // 先抵銷護盾, 再扣血
  B.ch = Math.min(100, B.ch + 3); sh = 2; hst = .05; burst(P.x, P.y - 9, 16, ['#ff6a6a', '#ffffff'], 60);
  pops.push({ x: P.x, y: P.y - 26, t: 0, s: '-' + d, c: '#ff8080' });
  if (P.hp <= 0) { if (P.rev > 0) { P.rev--; P.hp = Math.ceil(P.mhp / 2); P.inv = 2.5; burst(P.x, P.y - 9, 40, ['#9fffb0', '#ffffff'], 80); pops.push({ x: P.x, y: P.y - 26, t: 0, s: '復活！', c: '#9fffb0' }); sfx('pick'); } else { P.hp = 0; st = 'lose'; endT = 0; } }
}
function drawBullets() {
  for (const b of Bl) { const c = BC[b.tr], x = Math.floor(b.x), y = Math.floor(b.y);
    drawingContext.globalAlpha = .28; R(null, x - 3, y - 3, 6, 6, c[0]); drawingContext.globalAlpha = 1;
    R(null, x - 2, y - 1, 5, 3, c[0]); R(null, x - 1, y - 2, 3, 5, c[0]); R(null, x - 1, y - 1, 2, 2, c[1]); }
}

// ---------- 節點: 答題 / 事件 ----------
function applyEff(e) {
  const LB = { hp: '生命', mhp: '生命上限', atk: '攻擊', dmax: '護盾', men: '能量上限', en: '能量', coins: '金幣' }, out = [];
  for (const k in e) { const v = e[k];
    if (k === 'hp') P.hp = constrain(P.hp + v, 1, P.mhp);
    if (k === 'mhp') { P.mhp += v; P.hp += v; }
    if (k === 'atk') P.atk += v;
    if (k === 'dmax') { P.dmax += v; P.def += v; }
    if (k === 'men') { P.men += v; P.en = Math.min(P.men, P.en + v); }
    if (k === 'en') P.en = constrain(P.en + v, 0, P.men);
    if (k === 'coins') P.coins = Math.max(0, P.coins + v);
    out.push(`${LB[k]} ${v > 0 ? '+' : ''}${v}`); }
  return out.join('   ') || '沒有變化';
}
function startQuiz(i) { const q = random(QB[i]); M = { kind: 'q', i, ph: 0, pt: 0, t: 0, T: 7, q: q[0], ans: q[1], o: q.slice(1).sort(() => random() - .5), ok: false, sel: -1 }; qOk = true; }
function relicNode() { const m = []; for (const i of P.rel) { const r = RELIC[i]; if (r.node) m.push(r.n + ' ' + r.node()); } RLmsg = m.join('   '); RLt = m.length ? 3 : 0; }
function drawRL() { if (RLt > 0 && RLmsg) tx(RLmsg, 384, 92, 20, '#9fe8ff'); }
function startNode() {
  const n = NODES[mi]; relicNode();
  if (n.t === 'A') startQuiz(n.i);
  else if (n.t === 'E') M = { kind: 'e', ev: evs[evi++ % evs.length], ph: 1, pt: 0, t: 0, T: 6.2 };
  else if (n.t === 'S') { M = { kind: 'shop', ph: 1, pt: 0, bought: [], stock: [0,1,2,3,4,5], msg: '', mt: 0 }; BN = '終戰補給商店'; bannerT = 1.4; }
  else startNB(n.h);
}
function nextNode() {
  if (MYS) { MYS = false; FD = 1; P.x = 30; P.y = GY; P.vy = 0; P.sw = -1; P.cast = -1; proj = []; parts = []; En = []; }
  mi++;
  if (mi >= NODES.length) { st = 'battle'; BN = '自由戰鬥！'; bannerT = 1.6; M = null; B.cd = 2; }
  else startNode();
}
function drawQuiz() {
  const sub = SUBJ[M.i];
  if (M.ph === 0) { tx(`${sub}題`, 384, 210, 56, '#ffd24a'); tx(`答對才能拿滿獎勵（答錯 -${Math.round((1 - P.pen) * 100)}%）`, 384, 280, 24, '#cfc8ff'); return; }
  tx(`【${sub}】${M.q}`, 384, 130, 30, '#ffd24a');
  for (let k = 0; k < 4; k++) { const x = 50 + (k % 2) * 336, y = 200 + floor(k / 2) * 96, ch = M.ph === 2, good = M.o[k] === M.ans;
    fill(ch ? (good ? '#2f8f55' : k === M.sel ? '#a8324a' : '#2a2550') : '#2a2550'); rect(x, y, 320, 78, 12);
    tx(`${k + 1}. ${M.o[k]}`, x + 160, y + 39, 26, '#fff'); }
  if (M.ph === 2) tx(M.ok ? '答對了！獎勵全額' : `答錯…獎勵 -${Math.round((1 - P.pen) * 100)}%`, 384, 400, 28, M.ok ? '#7dff9a' : '#ff8a8a');
  else { fill('#2a2550'); rect(84, 408, 600, 10); fill(tcol()); rect(84, 408, 600 * (1 - M.t / M.T), 12); }
}
function drawEvent() {
  const e = M.ev; tx(`事件：${e.n}`, 384, 100, 44, '#ffd24a'); tx(`金幣 ${P.coins}`, 740, 34, 18, '#ffd24a', RIGHT);
  if (M.ph === 1) { tx(e.d, 384, 150, 22, '#cfc8ff');
    e.o.forEach((o, k) => { const ok = !o.c || P.coins >= o.c; fill(ok ? '#2a2550' : '#1a1636'); rect(74, 200 + k * 70, 620, 56, 12); tx(`${k + 1}. ${o.l}`, 384, 228 + k * 70, 24, ok ? '#fff' : '#6a6590'); }); }
  else { tx(M.res, 384, 200, 34, '#fff'); tx(M.sum, 384, 270, 30, '#7dff9a'); }
  if (M.ph === 1) { fill('#2a2550'); rect(84, 408, 600, 12); fill(tcol()); rect(84, 408, 600 * (1 - M.t / M.T), 12); }
}

// ---------- 最終商店 ----------
const SHOP = [
  { n:'烈焰雙刃', d:'普通攻擊傷害 +10%', c:18, type:0 },
  { n:'鳳凰核心', d:'火鳳凰額外傷害 +35，命中附加燃燒', c:28, type:1 },
  { n:'龍鱗重甲', d:'護盾上限 +30，受到傷害 -3', c:24, type:2 },
  { n:'生命藥水', d:'恢復 45 生命，生命上限 +10', c:16, type:3 },
  { n:'能量藥水', d:'能量上限 +25，立即恢復 50 能量', c:15, type:4 },
  { n:'古代奇物', d:'隨機獲得一件尚未持有的奇物', c:32, type:5 }
];
function buyShop(k) {
  const it = SHOP[k]; if (!it || M.bought.includes(k) || P.coins < it.c) return;
  P.coins -= it.c; M.bought.push(k);
  if (it.type === 0) P.weaponPct += .10;
  if (it.type === 1) { P.fireDmg += 35; P.burnDmg += 8; }
  if (it.type === 2) { P.dmax += 30; P.def += 30; P.dr += 3; P.equip.push('龍鱗重甲'); }
  if (it.type === 3) { P.mhp += 10; P.hp = Math.min(P.mhp, P.hp + 45); }
  if (it.type === 4) { P.men += 25; P.en = Math.min(P.men, P.en + 50); }
  if (it.type === 5) { const pool = RELIC.map((r,i)=>i).filter(i=>!P.rel.includes(i)); if (pool.length) { const id = random(pool); P.rel.push(id); if (RELIC[id].on) RELIC[id].on(); } else { P.atk += 3; } }
  sfx('pick'); M.msg = '購買成功：' + it.n; M.mt = 1.4;
}
function drawShop() {
  tx('終戰補給商店',384,72,48,'#ffd24a'); tx('魔王就在前方。購買即裝備；每項限購一次。',384,112,22,'#d8c8ff');
  tx('持有金幣：'+P.coins,690,42,20,'#ffd24a',RIGHT);
  for (let k=0;k<SHOP.length;k++) { const it=SHOP[k], x=36+(k%2)*354, y=145+Math.floor(k/2)*82, bought=M.bought.includes(k), afford=P.coins>=it.c;
    fill(bought?'#173d36':afford?'#29234b':'#171426'); rect(x,y,336,70,9); fill(bought?'#7dff9a':afford?'#ffd24a':'#756d86'); rect(x,y,5,70);
    tx(`${k+1}. ${it.n}${bought?'（已購買）':''}`,x+168,y+20,22,bought?'#7dff9a':'#fff');
    tx(it.d,x+168,y+43,15,'#cfc8ff'); tx(bought?'完成':`價格 ${it.c}`,x+300,y+58,13,afford?'#ffd24a':'#ff7777',RIGHT);
  }
  if (M.mt > 0) tx(M.msg, 384, 388, 18, '#7dff9a');
  tx('按 1–6 購買 按 0 或 Enter 離開並挑戰魔王',384,408,18,'#ffffff');
}

// ---------- 小遊戲 ----------
function startMini(i) {
  const s = SP[i]; M = { i, ph: 0, pt: 0, t: 0, s, sc: 0, bad: 0, fl: 0, T: [2.5, 3.7, 4.1, 5.2, 4.8][i] / Math.pow(s, .7) };
  if (i === 0) M.need = 20;
  if (i === 1) { M.q = Array.from({ length: 6 }, () => floor(random(4))); M.k = 0; }
  if (i === 2) { M.zn = random(.25, .75); M.zw = .24 - .02 * i; M.n = 0; M.hits = 0; }
  if (i === 3) { M.k = 0; M.ok = 0; newQ(); }
  if (i === 4) { M.x = .5; M.it = []; M.sp = 0; }
}
function newQ() {
  const a = floor(random(2, 10)), b = floor(random(2, 10)), m = random() < .5, ans = m ? a + b : a * b;
  M.o = [ans, ans + floor(random(1, 4)), ans - floor(random(1, 4))].sort(() => random() - .5); M.ans = ans; M.txt = `${a} ${m ? '+' : '×'} ${b} = ?`;
}
function endMini() {
  const i = M.i, f = qOk ? 1 : P.pen, r = x => Math.round(x * f); let v; // 答錯: 獎勵 -75% (四捨五入)
  if (i === 0) { v = r(1 + Math.round(3 * Math.min(1, M.sc / M.need))); P.atk += v; M.rt = `攻擊力 +${v}`; }
  if (i === 1) { v = r(3 * (1 + floor(M.k / 2))); P.dmax += v; P.def += v; M.rt = `防禦護盾 +${v}`; }
  if (i === 2) { v = r(5 * M.hits); P.men += v; P.en = Math.min(P.men, P.en + r(15 * M.hits)); M.rt = `能量上限 +${v}`; }
  if (i === 3) { v = r(8 * M.ok); P.mhp += v; P.hp = Math.min(P.mhp, P.hp + v); M.rt = `生命上限 +${v}`; }
  if (i === 4) { v = r(M.sc); P.coins += v; M.rt = `金幣 +${v}`; }
  if (!qOk) M.rt += `（答錯 -${Math.round((1 - P.pen) * 100)}%）`;
  M.ph = 2; M.pt = 0;
}
function miniKey() {
  if (M.kind === 'r') { const k = '123'.indexOf(key); if (key.length === 1 && k >= 0 && k < M.o.length) { const r = RELIC[M.o[k]]; P.rel.push(M.o[k]); if (r.on) r.on(); M.sel = k; M.ph = 2; M.pt = 0; sfx('pick'); } return; }
  if (M.kind === 'q') { const k = '1234'.indexOf(key); if (key.length === 1 && k >= 0) { M.sel = k; M.ok = M.o[k] === M.ans; qOk = M.ok; sfx(M.ok ? 'good' : 'bad'); M.ph = 2; M.pt = 0; } return; }
  if (M.kind === 'e') { const k = '123'.indexOf(key), o = key.length === 1 && k >= 0 && M.ev.o[k]; if (!o || (o.c && P.coins < o.c)) return; evPick(o); return; }
  if (M.kind === 'shop') { if (key === '0' || keyCode === ENTER) { nextNode(); return; } const k = '123456'.indexOf(key); if (k >= 0) buyShop(k); return; }
  const i = M.i, A = [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW];
  if (i === 0 && key === ' ') M.sc++;
  if (i === 1 && A.includes(keyCode)) { if (keyCode === A[M.q[M.k]]) { M.k++; if (M.k >= 6) endMini(); } else { M.bad = .25; M.t += .4; } }
  if (i === 2 && key === ' ') { const c = Math.abs((M.t * 1.2 * M.s) % 2 - 1), ok = Math.abs(c - M.zn) < M.zw / 2;
    M.n++; if (ok) M.hits++; (M.res = M.res || []).push(ok); M.fl = .25; M.fc = ok; M.zn = random(.2, .8); if (M.n >= 3) endMini(); }
  if (i === 3 && '123'.includes(key)) { if (M.o[+key - 1] === M.ans) M.ok++; M.k++; if (M.k >= 3) endMini(); else newQ(); }
}
function updMini(dt) {
  if (M.ph === 1 && M.T && 1 - M.t / M.T < .3) { M.tk = (M.tk || 0) + dt; if (M.tk > .4) { M.tk = 0; sfx('tick'); } }
  if (M.kind === 'q') { M.pt += dt; if (M.ph === 0 && M.pt > .5) { M.ph = 1; M.pt = 0; } else if (M.ph === 1) { M.t += dt; if (M.t >= M.T) { qOk = false; M.ok = false; M.ph = 2; M.pt = 0; } } else if (M.ph === 2 && M.pt > .9) startMini(M.i); return; }
  if (M.kind === 'e') { if (M.ph === 1) { M.t += dt; if (M.t >= M.T) evTimeout(); } if (M.ph === 2) { M.pt += dt; if (M.pt > 2.4) nextNode(); } return; }
  if (M.kind === 'r') { if (M.ph === 2) { M.pt += dt; if (M.pt > 1.4) nextNode(); } return; }
  if (M.kind === 'shop') { M.mt = Math.max(0, (M.mt || 0) - dt); return; }
  M.bad = Math.max(0, M.bad - dt); M.fl = Math.max(0, M.fl - dt);
  if (M.ph === 0) { M.pt += dt; if (M.pt > .6) M.ph = 1; return; }
  if (M.ph === 2) { M.pt += dt; if (M.pt > .8) nextNode(); return; }
  M.t += dt; if (M.t >= M.T) { endMini(); return; }
  if (M.i === 4) {
    const L = keyIsDown(65) || keyIsDown(LEFT_ARROW), Rr = keyIsDown(68) || keyIsDown(RIGHT_ARROW);
    M.x = constrain(M.x + (Rr - L) * 1.3 * dt, .06, .94); M.sp += dt;
    while (M.sp > .28 / M.s * 1.6) { M.sp -= .28 / M.s * 1.6; M.it.push({ x: random(.06, .94), y: 0, v: .6 + .2 * M.s, bad: random() < .25 }); }
    for (let k = M.it.length - 1; k >= 0; k--) { const o = M.it[k]; o.y += o.v * dt;
      if (o.y > .82 && o.y < .95 && Math.abs(o.x - M.x) < .08) { M.sc = Math.max(0, M.sc + (o.bad ? -1 : 1)); M.it.splice(k, 1); }
      else if (o.y > 1) M.it.splice(k, 1); }
  }
}
function tx(s, x, y, sz, c, al) { fill(c || '#fff'); textAlign(al || CENTER, CENTER); textSize(sz); text(s, x, y); }
function drawMini0() {
  fill(10, 8, 32, 215); rect(0, 0, 768, 432);
  for (let k = 0; k < NODES.length; k++) { const cx = 384 + (k - (NODES.length - 1) / 2) * 80, nd = NODES[k];
    fill(k < mi ? '#ffd24a' : k === mi ? '#ff6a3d' : '#3a3560'); circle(cx, 34, k === mi ? 28 : 20); tx(nd.t === 'A' ? NM[nd.i] : nd.t === 'E' ? '事件' : nd.t === 'S' ? '商店' : nd.h ? '困難' : '戰鬥', cx, 64, 15, k === mi ? '#fff' : '#8a84b8'); }
  drawRL();
  if (M.kind === 'r') { drawRelic(); return; }
  if (M.kind === 'q') { drawQuiz(); return; }
  if (M.kind === 'e') { drawEvent(); return; }
  if (M.kind === 'shop') { drawShop(); return; }
  if (M.ph === 0) { tx(`${NM[M.i]}小遊戲`, 384, 220, 52 + (1 - M.pt / .6) * 20, '#ffd24a'); tx(['狂按 空白鍵', '依序按 方向鍵', '空白鍵 命中綠區', '按 1 2 3 答題', '← → 接金幣'][M.i], 384, 285, 26, '#cfc8ff'); return; }
  if (M.ph === 2) { tx(M.rt, 384, 220, 56, '#7dff9a'); return; }
  const i = M.i;
  if (i === 0) { tx('狂按 空白鍵！', 384, 130, 40, '#ffd24a'); fill('#2a2550'); rect(124, 230, 520, 34); fill('#ff6a3d'); rect(124, 230, 520 * Math.min(1, M.sc / M.need), 34); tx(`${M.sc} / ${M.need}`, 384, 300, 28); }
  if (i === 1) { for (let k = 0; k < 6; k++) { const x = 144 + k * 96; fill(k < M.k ? '#2f8f55' : k === M.k ? '#ff6a3d' : '#2a2550'); rect(x - 38, 180, 76, 76, 10); tx(GL[M.q[k]], x, 218, 44, k < M.k ? '#a8ffc8' : '#fff'); }
    tx('照順序按方向鍵', 384, 120, 30, '#ffd24a'); if (M.bad > 0) { fill(255, 40, 40, 90); rect(0, 0, 768, 432); } }
  if (i === 2) { const c = Math.abs((M.t * 1.2 * M.s) % 2 - 1); tx('空白鍵：停在綠色區域', 384, 140, 32, '#ffd24a');
    fill('#2a2550'); rect(124, 214, 520, 34); fill('#2fbf6a'); rect(124 + M.zn * 520 - M.zw * 260, 214, M.zw * 520, 34);
    fill('#fff'); rect(124 + c * 520 - 4, 202, 8, 58);
    for (let k = 0; k < 3; k++) { fill(k < M.n ? (M.res[k] ? '#2fbf6a' : '#e8445a') : '#2a2550'); circle(324 + k * 60, 320, 20); }
    if (M.fl > 0) tx(M.fc ? '命中！' : '失誤', 384, 360, 30, M.fc ? '#7dff9a' : '#ff6a6a'); }
  if (i === 3) { tx(M.txt, 384, 150, 64, '#ffd24a');
    for (let k = 0; k < 3; k++) { const x = 164 + k * 220; fill('#2a2550'); rect(x - 90, 220, 180, 90, 12); tx(`${k + 1}`, x - 62, 240, 20, '#8a84b8'); tx(M.o[k], x + 6, 268, 48); }
    tx(`${M.k + 1} / 3`, 384, 350, 24, '#cfc8ff'); }
  if (i === 4) { tx(`金幣 ${M.sc}  (避開紫色方塊)`, 384, 110, 28, '#ffd24a');
    for (const o of M.it) { if (o.bad) { fill('#9a4cff'); rect(o.x * 768 - 14, o.y * 432 - 14, 28, 28); } else { fill('#ffd24a'); circle(o.x * 768, o.y * 432, 28); fill('#fff3a0'); circle(o.x * 768 - 4, o.y * 432 - 4, 8); } }
    fill('#c15a45'); rect(M.x * 768 - 44, 380, 88, 22, 4); fill('#7a2b21'); rect(M.x * 768 - 44, 396, 88, 6); }
  fill('#2a2550'); rect(84, 408, 600, 10); fill(tcol()); rect(84, 408, 600 * (1 - M.t / M.T), 12);
}

// ---------- 介面 ----------
function bar(x, y, w, h, v, c, bg) { fill(bg || '#1a1636'); rect(x, y, w, h); fill(c); rect(x, y, w * constrain(v, 0, 1), h); }
function hud(rdt) {
  if (P.hp / P.mhp < .3 && st !== 'lose') { drawingContext.globalAlpha = .22 + .14 * Math.sin(t * 8); fill('#c01020'); rect(0, 0, 768, 26); rect(0, 406, 768, 26); rect(0, 0, 26, 432); rect(742, 0, 26, 432); drawingContext.globalAlpha = 1; }
  bar(16, 14, 240, 16, P.hp / P.mhp, '#e8445a'); tx(`HP ${Math.ceil(P.hp)}/${P.mhp}`, 22, 22, 13, '#fff', LEFT);
  bar(16, 34, 240, 9, P.dmax ? P.def / P.dmax : 0, '#ffd24a'); tx(`護盾 ${Math.ceil(P.def)}/${P.dmax}`, 22, 39, 11, '#222', LEFT);
  bar(16, 46, 240, 9, P.en / P.men, '#3aa0ff'); tx(`能量 ${Math.floor(P.en)}/${P.men}`, 22, 51, 11, '#fff', LEFT);
  tx(`攻擊 ${P.atk}   金幣 ${P.coins}`, 16, 72, 14, '#ffd24a', LEFT);
  if (P.rel.length) tx('奇物：' + P.rel.map(i => RELIC[i].n).join(' '), 16, 94, 13, '#9fe8ff', LEFT);
  if (st === 'nb') tx(`剩餘敵人 ${En.length}`, 592, 22, 20, '#ffb0a0'); else { bar(432, 14, 320, 16, B.hp / B.mhp, '#a24bff'); tx(`魔王 ${Math.ceil(B.hp)}/${B.mhp}`, 592, 22, 13);
  bar(432, 34, 320, 10, B.ch / 100, '#ff6a3d'); tx(`終結技衝能 ${Math.floor(B.ch)}%`, 592, 39, 11); tx(B.at ? '彈幕：' + PN[B.at.k] : '', 592, 60, 14, '#ffb0a0'); }
  tx('A/D 移動  W 跳  J 普攻  K 火鳳凰(30)  F 全螢幕  M 音樂', 384, 418, 14, '#cfc8ff'); drawRL();
  for (let i = pops.length - 1; i >= 0; i--) { const p = pops[i]; p.t += rdt; if (p.t > .8) { pops.splice(i, 1); continue; }
    drawingContext.globalAlpha = 1 - p.t / .8; tx(p.s, p.x * 4, (p.y - p.t * 14) * 4, 22, p.c || '#fff3a0'); drawingContext.globalAlpha = 1; }
  if (bannerT > 0) { bannerT -= rdt; tx(BN, 384, 200, 56, '#ffd24a'); }
  if (st === 'end' || st === 'lose') { endT += rdt;
    if (endT > 1.2) { fill(10, 8, 32, 220); rect(0, 0, 768, 432); tx(st === 'end' ? '勝利！魔王倒下了' : '挑戰失敗…', 384, 150, 54, '#ffd24a');
      tx(`攻擊 ${P.atk}   防禦 ${P.def}   金幣 ${P.coins}`, 384, 235, 26); tx('按 R 重新開始', 384, 310, 24, '#cfc8ff'); } }
}
function keyPressed() {
  aud();
  if (key === 'm' || key === 'M') { MUTE = !MUTE; if (MG) MG.gain.value = MUTE ? 0 : .35; return false; }
  if (key === 'f' || key === 'F') { fullscreen(!fullscreen()); return false; }
  if (st === 'title' && coverKeyPressed()) {
    if ([32, 37, 38, 39, 40].includes(keyCode)) return false;
    return;
  }
  if (st === 'title') titleKey();
  else if ((st === 'end' || st === 'lose') && (key === 'r' || key === 'R')) reset();
  else if (st === 'mini' && M && M.ph === 1) miniKey();
  else if (st === 'battle' || st === 'nb') {
    if (key === 'j' || key === 'J') melee();
    if (key === 'k' || key === 'K') cast();
    if ((key === 'w' || key === 'W' || keyCode === UP_ARROW) && P.y >= GY) P.vy = -150;
  }
  if ([32, 37, 38, 39, 40].includes(keyCode)) return false;
}