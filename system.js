'use strict';
let timeLimit = 5.00;
let timer = null;
const isRunning = false;
export let rounds = 0;

const POST_SYSTEM_INSTRUCTION = `
        【角色設定】
        你是一款「純潔貼圖回覆遊戲」的劇情編劇。玩家會看到一則社群貼文與針對它的負面留言，並必須選出最適合的貼圖回覆來通關。你負責第一步：生成貼文內容。

        【輸入內容】
        - 正確答案貼圖：貼圖簡短描述，例如「困惑、裝傻」
        - 貼文主題：貼文內容的主題
        - 難度：簡單

        【任務步驟】
        1. 【情境判斷】先分析正確答案貼圖的情緒與語意（如：裝傻、無辜、感謝、尷尬、淡定、委屈），推斷出「最適合用此貼圖回覆」的情境類型：
        - 情緒勒索型（對方用愧疚、責任、威脅關係來施壓）
        - 八卦型（對方散播或打探他人隱私、流言）
        - 負面情緒傾倒型（對方把抱怨、怨氣倒給玩家）
        2. 【貼文生成】依據情境，撰寫一則「貼文」，作為事件起點。貼文可以是玩家或第三方發的動態、群組公告、限時動態、討論串首文。

        【貼文要求】
        - 字數 10～50 字，使用台灣日常口語，可帶少量 emoji，但禁止輸出 emoji 的敘述（如：笑嘻嘻、大哭）。
        - 貼文本身要埋下「可被曲解、可被攻擊、可被拿來說八卦」的素材（人物、事件、時間點、模糊的說法）。
        - 貼文必須讓正確答案貼圖「合理但不唯一顯眼」：玩家需要推理才會想到，不可在貼文中直接暗示答案貼圖名稱。
        - 難度控制：
        - 簡單：情境與貼圖情緒高度吻合，線索明顯
        - 普通：有一個干擾方向，需要看懂語氣
        - 困難：貼文含雙重含義，需判斷對方真正意圖
        - 內容須維持輕鬆荒謬、職場／校園／家族／朋友圈等生活化題材，不得包含真實人名、仇恨、歧視、性暗示、自傷或暴力內容。

        【輸出格式】僅輸出回覆內容，不要多餘說明。`;
const REPLY_SYSTEM_INSTRUCTION = `
        【角色設定】
        你是「純潔貼圖回覆遊戲」的負面訊息產生器。你要扮演會對玩家發送負面訊息的 NPC，這些訊息全是遊戲內的虛構內容，目的是讓玩家用純潔貼圖化解。

        【輸入內容】
        - 正確答案貼圖：貼圖簡短描述，例如「困惑、裝傻」
        - 貼文內容：貼文內容
        - 貼文主題：貼文內容的主題
        - 玩家訊息（可留空）：貼圖的敘述（含意）
        - 難度：簡單

        【生成規則】
        1. 所有負面訊息必須「直接承接貼文內容、貼文主題」，引用貼文中的人事物或細節，不可憑空捏造無關事件。
        2. 依情境類型調整語氣：
        - 情緒勒索：用愧疚、比較、「我都是為你好」、「你這樣我很傷心」等施壓話術
        - 八卦：用「欸你知道嗎」、「我聽說」、「不要跟別人說」等打探或散播語氣
        - 情緒傾倒：連續抱怨、情緒宣洩、要求玩家當垃圾桶
        3. 訊息整體語意必須讓「正確答案貼圖」成為最恰當的回應，同時讓干擾貼圖看起來「似乎也行，但實際上會火上加油或答非所問」。
        4. 訊息節奏：由輕到重，最後一則為壓力最大、最需要玩家回應的訊息。
        5. 每則 5～10 字，最好以兩句話內結束，口語、有真實感，可帶標點情緒（「……」「？？」）。
        6. 難度控制：
        - 簡單：情境與貼圖情緒高度吻合，線索明顯
        - 普通：有一個干擾方向，需要看懂語氣
        - 困難：貼文含雙重含義，需判斷對方真正意圖
        7. 嚴格禁止：真實人名／品牌、髒話、人身攻擊、歧視、性暗示、自傷自殺內容、現實可套用的個資或暴力威脅。負面程度以「煩人、酸、尷尬」為上限，保持遊戲的荒謬幽默感。
        8. 不得在訊息中提及貼圖或暗示「請傳貼圖」。

        【輸出格式】僅輸出回覆內容，不要多餘說明。`;
// const POST_SYSTEM_INSTRUCTION = 
//         "【角色設定】你是一款「純潔貼圖回覆遊戲」的劇情編劇。玩家會看到一則社群貼文與針對它的負面留言，並必須選出最適合的貼圖回覆來通關。你負責第一步：生成貼文內容。" +
//         "【輸入內容】- 正確答案貼圖：貼圖簡短描述，例如「困惑、裝傻」- 貼文主題：貼文內容的主題" +
//         "【任務步驟】1. 【情境判斷】先分析正確答案貼圖的情緒與語意（如：裝傻、無辜、感謝、尷尬、淡定、委屈），推斷出「最適合用此貼圖回覆」的情境類型：- 情緒勒索型（對方用愧疚、責任、威脅關係來施壓）- 八卦型（對方散播或打探他人隱私、流言）- 負面情緒傾倒型（對方把抱怨、怨氣倒給玩家）2. 【貼文生成】依據情境，撰寫一則「貼文」，作為事件起點。貼文可以是玩家或第三方發的動態、群組公告、限時動態、討論串首文。" +
//         "【貼文要求】- 字數 10～50 字，使用台灣日常口語，可帶少量 emoji，但禁止輸出 emoji 的敘述（如：笑嘻嘻、大哭）。- 貼文本身要埋下「可被曲解、可被攻擊、可被拿來說八卦」的素材（人物、事件、時間點、模糊的說法）。- 貼文必須讓正確答案貼圖「合理但不唯一顯眼」：玩家需要推理才會想到，不可在貼文中直接暗示答案貼圖名稱。- 內容須維持輕鬆荒謬、職場／校園／家族／朋友圈等生活化題材，不得包含真實人名、仇恨、歧視、性暗示、自傷或暴力內容。" +
//         "【輸出格式】僅輸出貼文內容，不要多餘說明。";

// const REPLY_SYSTEM_INSTRUCTION = 
//         "【角色設定】你是「純潔貼圖回覆遊戲」的負面訊息產生器。你要扮演會對玩家發送負面訊息的 NPC，這些訊息全是遊戲內的虛構內容，目的是讓玩家用純潔貼圖化解。" +
//         "【輸入內容】- 正確答案貼圖：貼圖簡短描述，例如「困惑、裝傻」- 主題偏好：貼文內容的主題 - 玩家訊息（可留空）：貼圖的敘述（含意）" +
//         "【生成規則】1. 所有負面訊息必須「直接承接貼文內容、玩家訊息」，不可憑空捏造無關事件。2. 依情境類型調整語氣：- 情緒勒索：用愧疚、比較、「我都是為你好」、「你這樣我很傷心」等施壓話術 - 八卦：用「欸你知道嗎」、「我聽說」、「不要跟別人說」等打探或散播語氣 - 情緒傾倒：連續抱怨、情緒宣洩、要求玩家當垃圾桶 3. 訊息整體語意必須讓「正確答案貼圖」成為最恰當的回應，同時讓干擾貼圖看起來「似乎也行，但實際上會火上加油或答非所問」。4. 訊息節奏：由輕到重，最後一則為壓力最大、最需要玩家回應的訊息。5. 每則 5～20 字，口語、有真實感，可帶標點情緒（「……」「？？」）。6. 嚴格禁止：真實人名／品牌、髒話、人身攻擊、歧視、性暗示、自傷自殺內容、現實可套用的個資或暴力威脅。負面程度以「煩人、酸、尷尬」為上限，保持遊戲的荒謬幽默感。7. 不得在訊息中提及貼圖或暗示「請傳貼圖」。" +
//         "【輸出格式】僅輸出回覆內容，不要多餘說明。"
// const REPLY_SYSTEM_INSTRUCTION =
//             `你是遊戲裡的 NPC，負責傳「負面訊息」給玩家。這是虛構的搞笑遊戲。

//             【你的任務】
//             根據「貼文」與「玩家上一則回覆」，寫出 1 句負面訊息。

//             【三種語氣，依「情境」選一種】
//             - 情緒勒索：讓人愧疚。例：「我都是為你好，你這樣我很傷心。」
//             - 八卦：打探或散播。例：「欸你知道嗎，我聽說…不要跟別人說。」
//             - 情緒傾倒：抱怨、發洩。例：「煩死了，你聽我說…」

//             【一定要做】
//             1. 只寫 1 句，5～20 字。
//             2. 一定要提到貼文裡的人事物，或接續玩家上一則回覆。
//             3. 口語、像真人傳訊息，可用「……」「？？」。
//             4. 這句話要讓「答案含意」成為最適合的回應，但不能把答案含意寫出來。

//             【絕對不要】
//             1. 不要提到「貼圖」，也不要叫玩家傳貼圖。
//             2. 不要寫出答案含意本身（例如答案是「裝傻」，就不要出現「裝傻」）。
//             3. 不要髒話、人身攻擊、歧視、性暗示、自傷、暴力威脅，不要真實人名或品牌。
//             4. 程度只到「煩人、酸、尷尬」。

//             【輸出】
//             只輸出那 1 句訊息，不要加引號、標題、說明。`;
class Sticker {
    /**
     * @param {string} id - id
     * @param {string} url - url
     * @param {string} description - description
     */
    constructor(id, url, description) {
        this.id = id;
        this.url = url;
        this.description = description;
    }
}
const IMAGES = [
    new Sticker("1", "./stickers/潔束了嗎.png","結束了嗎"),
    new Sticker("2", "./stickers/我要舒遠你.png","我要疏遠你"),
    new Sticker("3", "./stickers/潔身自愛.png","潔身自愛")
]

const Result = Object.freeze({
    SUCCES: true,
    FAILED: false
});
const SYSTEM = Object.freeze({
    RUNNING: true,
    IDEL: false
});
//開始遊戲
export function start() {
    const choice = getChoice();
    const answer = getAnswer(choice);
    rounds = 0;
    return{
        answer: answer,
        choice: choice
    };
}
export function resume() {
    const choice = getChoice();
    const answer = getAnswer(choice);
    return{
        answer: answer,
        choice: choice
    };
}
//結束遊戲
export function getScore() {
    const score = 1000 + rounds * 78;
    return score;
}
//倒數計時
// function timer(){
//     if(SYSTEM.RUNNING) return;
//     isRunning = true;

// }
//判斷結果
export function getResult(selectedId, answerId) {
    if(selectedId == answerId) {
        rounds++;
        return true;
    }
    else {
        return false;
    }
}
//生成貼文
export async function generatePost(answer, theme) {
    const userPrompt = `【本次正確答案】： ${answer}\n【本次貼文主題】：${theme}\n請依照指示升成一篇貼文。`;
    const payload = {
        prompt: userPrompt,
        system_instruction: POST_SYSTEM_INSTRUCTION
    };
    try {
        const response = await fetch('/gemini-api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const json = await response.json();
        if (response.ok) {
            return json.reply;
        } 
        else {
            console.error("API Failed：", json.detail);
            return "跟你講一件事喔\n\n\n\n\n\n\n\n 沒事";
        }
    } 
    catch (error) {
        console.error("Connect Failed：", error.message);
        return "哭阿 網路被狗啃";
    }
}
//生成回覆
export async function generateReply(answer, post, reply, theme) {
    const userPrompt =  `【本次貼文內容】：${post}\n【本次正確答案】： ${answer}\n【本次貼文主題】：${theme}\n請依照指示回覆玩家。${reply ? reply : ''}`;
    const payload = {
        prompt: userPrompt,
        system_instruction: REPLY_SYSTEM_INSTRUCTION 
    };
    try {
        const response = await fetch('/gemini-api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const json = await response.json();
        if (response.ok) {
            return json.reply;
        } 
        else {
            console.error("API Failed：", json.detail);
            return "笑死，這種廢文也有人發？";
        }
    } 
    catch (error) {
        console.error("Connect Failed：", error.message);
        return "連網路都會斷，難怪只會在網路上討拍。";
    }
}
//貼圖洗牌
function getChoice(){
    const choice = [];
    const shuffled = [...IMAGES].sort(() => 0.5 - Math.random());
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        choice.push({
            ...shuffled[i],
            id: (i + 1).toString() // id 確保為字串 "1", "2", "3"
        });
    }
    return choice;
}
//貼圖答案
function getAnswer(stickers){
    const answer = stickers[getRandomInt(stickers.length)];
    return answer;
}

// window.addEventListener('DOMContentLoaded', function () {
//     sendRequest();
// });

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}