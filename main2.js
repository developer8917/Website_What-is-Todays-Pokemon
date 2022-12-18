const container = document.querySelector(".image-container")
const startButton = document.querySelector(".start-button")
const gameText = document.querySelector(".game-text")
const playTime = document.querySelector(".play-time")

// 고정값으로 잡아둘 숫자
const maxNum = 905;     // 포켓몬 도감 905번까지 있음
const minNum = 1;       // 1번부터 시작
var randNum = 1;        // 배정받을 포켓몬 숫자, 기본값은 일단 1로 배정 

// 16개 칸으로 나눌것
let tiles = [];
const tileCount = 16;
// 게임 플레이 중인지 유무
let isPlaying = false;

// 시간 체크
let timeInterval = null;
let time = 0;

// 드래그에 사용
const dragged = {
    el: null,
    class: null,
    index: null,
}

// function

// load 함수는 해당 페이지의 모든 요소가 로드 된 후 처리되므로 load 대신 사용
$(document).ready(function() {
    // 처음 시작할 때는 텍스트 안보이게
    gameText.style.display = "none";
    container.innerHTML = "";
    tiles = createImageTiles();
    tiles.forEach(tile => container.appendChild(tile))
    document.getAttribute
});

// 내가 배치한 엘리먼트가 원래 정답 위치에 배치 되었는지 카운트하는 함수
function checkStatus(){
    const currentList = [...container.children];
    // filter = 내가 필터링한 엘리먼트만 return 시킴
    const unMatchedList = currentList.filter( (child, index) => Number(child.getAttribute("data-index")) !== index)
    // 아래 소스를 한줄로 줄여서 return로 생략했음
    // const unMatchedList = currentList.filter( (child, index) => {
    //     return Number(child.getAttribute("data-index")) !== index
    // })
    if (unMatchedList.length === 0){
        gameText.style.display = "block";
        isPlaying = false;
        // 게임 시간 초기화
        clearInterval(timeInterval);
    }
}

function setGame(){
    isPlaying = true;
    container.innerHTML = "";
    // 시작할때 시간 0초로 리셋
    time = 0;
    // 게임을 다시 시작할 때도 텍스트 안보이게
    gameText.style.display = "none";
    setTimeout(()=>{
        container.innerHTML = "";
        shuffle(tiles).forEach(tile => container.appendChild(tile))
    })    // 2초
    
    // 게임 시간 초기화
    // clearInterval(timeInterval);
    timeInterval = setInterval ( () =>{
        playTime.innerText = `경과시간 : ${time}`;
        time++;
    }, 1000)
}

// 배열 반복문 돌림
// li를 생성해줄거임
function createImageTiles(){
    // 사진을 가져오기 위한 숫자를 뽑기 위해 랜덤한 숫자를 뽑음
    randNum = Math.floor(Math.random() * maxNum)+minNum;

    // 뽑은 숫자 자리수에 맞춰서 앞에 0을 채워주기 위해 사용
    // ex ) 001, 005, 015, 075...
    var Zerolen = ""

    Num = randNum.toString();  // 숫자를 문자열로 만듬

    if (Num.length == 1)
        Zerolen = "00"
    else if (Num.length == 2)
        Zerolen = "0"
    else
        Zerolen = ""

    const tempArray = [];
    Array(tileCount).fill().forEach( (_, index) => {
        const li = document.createElement("li");
        //li.setAttribute('background', url("https://www.serebii.net/pokemon/art/004.png"))
        li.setAttribute('data-index', index)
        li.setAttribute('draggable', 'true');   // 드래그 잘 되게 하려고 사용
        li.classList.add(`list${index}`);
        container.appendChild(li);
        tempArray.push(li)
    })
    $('#Container li').css('background', 'https://www.serebii.net/pokemon/art/004.png');
    return tempArray;
}

function shuffle(array) {
    let index = array.length -1;
    while(index > 0){
        const randomIndex = Math.floor(Math.random()*(index+1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
        index--;
    }
    return array;
}

// events

// dragstart
container.addEventListener('dragstart', e => {
    // 게임중이 아니면 작동 안되게 return 시킴
    if (!isPlaying) return;
    // e.target를 계속 사용하므로 변수로 사용
    const obj = e.target;
    dragged.el = obj;
    dragged.class = obj.className;
    // ...을 하게 되면 가지고 있는 기본 원소가 불러진다.
    // object라서 type 변경을 위해 사용 
    dragged.index = [...obj.parentNode.children].indexOf(obj);
})

// dragover
container.addEventListener('dragover', (e) => {
    e.preventDefault(); // drop 할때 dragover 이벤트 발생하지 않도록 사용
})

// drop
container.addEventListener('drop', e => {
    // 게임중이 아니면 작동 안되게 return 시킴
    if (!isPlaying) return;

    const obj = e.target;
    let originPlace;
    let isLast = false;

    if(obj.className !== dragged.class) {
        // nextSibling = 드롭한 엘리먼트의 다음 엘레먼트
        if(dragged.el.nextSibling){
            // 가져온 그 시점을 저장
            originPlace = dragged.el.nextSibling;
        } else  // 드래그한 엘리먼트가 다음 엘리먼트가 없다 = 마지막놈이다
        {
            // previousSibling = 드롭한 엘레먼트의 앞 엘레먼트
            originPlace = dragged.el.previousSibling
            // 마지막 엘레먼트라는 의미라서 isLast를 true로 변경
            isLast = true;
        }
        
        const droppedIndex = [...obj.parentNode.children].indexOf(obj);

        // 드래그한 인덱스가 앞인지 뒤인지 확인해서 위치 변경
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el)

        // 마지막 부분에서 가져왔으면 드롭되서 밀려난놈을 맨 마지막에 넣는다
        isLast ? originPlace.after(obj) : originPlace.before(obj);
    }

    checkStatus();
})

startButton.addEventListener('click', () => {
    setGame();
})