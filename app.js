'use strict';
import { start, generatePost, generateReply, getResult, getScore, rounds, resume } from "./system.js";

const $=id=>document.getElementById(id);
let nickname='不要醬紙',selectedSticker=null,liked=false;
const entries=[];
let stickerSet=null, postContent=null, history=null;

function toast(s, time){
    $('toast').textContent=s;$('toast').classList.add('show');
    clearTimeout(window._toast);
    window._toast=setTimeout(()=>$('toast').classList.remove('show'),time)
}

function page(id){
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));
    closeMenu();
    window.scrollTo({top:0,behavior:'instant'});
    if(id==='ranking')renderRanking();
}

function closeMenu(){
    $('menu').classList.remove('open');
    $('menuShade').classList.remove('open')
}

document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>page(b.dataset.page)));

$('menuBtn').onclick=()=>{
    $('menu').classList.add('open');
    $('menuShade').classList.add('open')
};

$('closeMenu').onclick=closeMenu;
$('menuShade').onclick=closeMenu;

$('faqBtn').onclick=()=>{
    closeMenu();
    toast('常見問題內容尚待提供', 2100);
};

const names=['不要醬紙','巾天好冷','笑到擦眼淚','冷到結冰','濕在太好笑'];

$('randomName').onclick=()=>{
    $('nicknameInput').value=names[Math.floor(Math.random()*names.length)]
};

$('startBtn').onclick=async()=>{
    nickname=$('nicknameInput').value.trim();
    if(!nickname){
        toast('請先輸入暱稱', 2100);
        return;
    }
    toast(' AI 正在生成中，請稍候...', 20000);

    stickerSet = start();
    selectedSticker = null;
    liked = false;
    history = [];
    try{
        postContent = await generatePost(stickerSet.answer.description, "舒潔 99% 純水濕式面紙");
        history.push({
            role: "user",
            parts: [{ text: postContent }]
        });
        document.querySelectorAll('#post-content').forEach(p => p.textContent = postContent);
        const reply1 = await generateReply(stickerSet.answer.description, postContent, "舒潔 99% 純水濕式面紙", history);
        history.push({
            role: "model",
            parts: [{ text: reply1 }]
        });
        const reply2 = await generateReply(stickerSet.answer.description, postContent, "舒潔 99% 純水濕式面紙", history);
        history.push({
            role: "model",
            parts: [{ text: reply2 }]
        });
        $('comments').innerHTML=`<div class="reply"><span class="avatar small"></span><div><b>aaa_yoon</b> <small>3秒前</small><p>${reply1}</p><span>♡ 1234　▢ 1234</span><div class="reply nested"><span class="avatar small"></span><div><b>aaa_yoon</b> <small>3秒前</small><p>${reply2}</p><span>♡ 1234　▢ 1234</span></div></div></div></div>`;
        document.querySelectorAll('.stickers button').forEach(b=>{
            b.classList.remove('selected');
            const stickerId = b.dataset.sticker;
            const img = b.querySelector('img');
            if (img && stickerId) {
                const sticker = stickerSet.choice.find(s => s.id == stickerId);
                if(sticker){
                    img.src = sticker.url;
                    img.alt = sticker.description;
                }
            }
        });
        page('thread');
    }
    catch (error) {
        console.error('生成內容失敗：', error);
        toast('連線失敗，請重新再試一次', 2100);
    }
};

$('postLike').onclick=()=>{
    liked=!liked;
    $('postLike').innerHTML=(liked?'♥':'♡')+' <span id="likeCount">'+(liked?1235:1234)+'</span>';
};

document.querySelectorAll('[data-sticker]').forEach(b=>b.onclick=()=>{
    selectedSticker=b.dataset.sticker;
    document.querySelectorAll('[data-sticker]').forEach(x=>x.classList.toggle('selected',x===b));
});

async function sendReply(){
    $('sendReply').disabled = true;
    try{
        const value=$('replyText').value.trim();
        const sticker = stickerSet.choice.find(s => s.id == selectedSticker);
        if(!value&&!sticker){
            toast('請輸入回覆或選擇貼圖', 2100);
            return
        };
        const el=document.createElement('div');
        el.className='reply';
        const avatar=document.createElement('span');
        avatar.className='avatar small';
        const content=document.createElement('div');
        const title=document.createElement('b');
        title.textContent=nickname;
        const stamp=document.createElement('small');
        stamp.textContent=' 剛剛';
        const p=document.createElement('p');
        const img=document.createElement('img');
        if(value){
            p.textContent=$('replyText').textContent
            history.push({
                role: "user",
                parts: [{ text: `${('replyText').textContent}`}]
            });
        }
        if(sticker){
            img.src = sticker.url;
            history.push({
                role: "user",
                parts: [{ text: `（貼圖敘述）${sticker.description}`}]
            });
        }
        const meta=document.createElement('span');
        meta.textContent='♡ 0　▢ 0';
        content.append(title,stamp,p,img,meta);
        el.append(avatar,content);
        $('comments').append(el);
        const pass = getResult(sticker.id, stickerSet.answer.id);
        if(pass || !sticker){
            toast("成功", 2100);
            stickerSet = resume()
            document.querySelectorAll('.stickers button').forEach(b => {
                b.classList.remove('selected');
                const stickerId = b.dataset.sticker;
                const img = b.querySelector('img');
                if (img && stickerId) {
                    const newSticker = stickerSet.choice.find(s => s.id == stickerId);
                    if(newSticker){
                        img.src = newSticker.url;
                        img.alt = newSticker.description;
                    }
                }
            });
            const el=document.createElement('div');
            el.className='reply';
            const avatar=document.createElement('span');
            avatar.className='avatar small';
            const content=document.createElement('div');
            const title=document.createElement('b');
            title.textContent=aaa_yoon;
            const stamp=document.createElement('small');
            stamp.textContent=' 剛剛';
            const p=document.createElement('p');
            toast(' AI 正在生成中，請稍候...', 2100);
            const reply = await generateReply(stickerSet.answer.description, postContent, "舒潔 99% 純水濕式面紙", history);
            p.textContent = reply;
            history.push({
                role: "model",
                parts: [{ text: reply }]
            });
            const meta=document.createElement('span');
            meta.textContent='♡ 0　▢ 0';
            content.append(title,stamp,p,meta);
            el.append(avatar,content);
            $('comments').append(el);
        }
        else {
            toast("失敗", 2100);
            $('score').textContent=getScore()+'分';
            entries.push({name:nickname,score});
            $('resultComments').innerHTML='';
            document.querySelectorAll('#comments>.reply').forEach(x=>$('resultComments').append(x.cloneNode(true)));
            page('result');
        }
        $('replyText').value='';
        selectedSticker=null;
        document.querySelectorAll('.stickers button').forEach(b=>b.classList.remove('selected'));
    }
    catch (error) {
    console.error('生成內容失敗：', error);
    toast('連線失敗，請重新再試一次', 2100);
    }
    finally {
        $('sendReply').disabled = false;
    }
}

$('sendReply').onclick=sendReply;
$('replyText').addEventListener('keydown',e=>{if(e.key==='Enter') sendReply()});

function renderRanking(){
    const box=$('rankBox');
    box.replaceChildren();
    if(!entries.length){
        const p=document.createElement('p');
        p.className='empty-rank';
        p.innerHTML='目前尚無挑戰紀錄<br>完成挑戰後會顯示在這裡';
        box.append(p);
        return;
    }
    entries.slice().sort((a,b)=>b.score-a.score).forEach((e,i)=>{
        const row=document.createElement('div');
        row.className='rank-item';
        const name=document.createElement('span');
        name.textContent=`${i+1}. ${e.name}`;
        const score=document.createElement('b');
        score.textContent=e.score+'分';
        row.append(name,score);
        box.append(row);
    });
};
$('adPrev').onclick=$('adNext').onclick=()=>toast('廣告內容尚未提供', 2100);
$('replay').onclick=()=>page('nickname');
$('saveResult').onclick=()=>{toast('可使用手機截圖儲存此畫面', 2100)};
$('shareResult').onclick=()=>{
    const message=`我在舒潔水啦挑戰拿到 ${$('score').textContent}！`;
    const url='https://www.threads.net/intent/post?text='+encodeURIComponent(message);
    window.open(url,'_blank','noopener,noreferrer');
};

