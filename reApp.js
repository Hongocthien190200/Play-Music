const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const next = $('.btn-next');
const prev = $('.btn-prev');
const repeat = $('.btn-repeat');
const randomBtn = $('.btn-random');
const playlist = $('.playlist');
const app = {

    isPlaying: false,
    currenIndex: 0,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Flowers',
            singer: 'Miley Cyrus',
            path: './assets/music/song1.mp3',
            image: './assets/image/song1.jpg'
        },
        {
            name: 'Bên trên tầng lầu',
            singer: 'Tăng Duy Tân',
            path: './assets/music/song2.mp3',
            image: './assets/image/song2.jpg'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            path: './assets/music/song3.mp3',
            image: './assets/image/song3.jpg'
        },
        {
            name: 'Điều anh biết',
            singer: 'Chi Dân',
            path: './assets/music/song4.mp3',
            image: './assets/image/song4.jpg'
        },
        {
            name: 'Ido',
            singer: 'Đức Phúc',
            path: './assets/music/song5.mp3',
            image: './assets/image/song5.jpg'
        },
        {
            name: 'Em không thể',
            singer: 'Tiên Tiên',
            path: './assets/music/song6.mp3',
            image: './assets/image/song6.jpg'
        },
        {
            name: 'Em là',
            singer: 'MONO',
            path: './assets/music/song7.mp3',
            image: './assets/image/song7.jpg'
        },
        {
            name: 'Ngày đầu tiên',
            singer: 'Đức Phúc',
            path: './assets/music/song8.mp3',
            image: './assets/image/song8.jpg'
        },
        {
            name: 'Ngôi sao cô đơn',
            singer: 'Jack-J97',
            path: './assets/music/song9.mp3',
            image: './assets/image/song9.jpg'
        },
        {
            name: 'Ngủ một mình',
            singer: 'HIEUTHUHAI',
            path: './assets/music/song10.mp3',
            image: './assets/image/song10.jpg'
        },
        {
            name: 'Vì mẹ anh bắt chia tay',
            singer: 'Miu Lê ft Karik',
            path: './assets/music/song11.mp3',
            image: './assets/image/song11.jpg'
        },

    ],
    render: function () {
        const htmls = this.songs.map(function(song,index){
            
            return `
            <div class="song ${index === app.currenIndex ? 'active':''} " data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                </div>
            </div>
            `
        });
        
        playlist.innerHTML = htmls.join('');
    },
    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currenIndex];
            }
        })
    },

    handleEvent: function () {

        const _this = this;

        //xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();
        //xử lý cuộn trang lên/xuống
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }
        //xử lý playBtn

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }
        //khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }
        //khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //xử lý khi tua bài hát
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };
        //xử lý khi next bài hát 
        next.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else { _this.nextSong(); }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //xử lý khi prev bài hát trước đó
        prev.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else { _this.prevSong(); }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //xử lý khi random bài hát
        randomBtn.onclick = function () {
            _this.isRandom =!_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //xử lý khi repeat bài hát
        repeat.onclick = function () {
            _this.isRepeat =!_this.isRepeat;
            repeat.classList.toggle('active',_this.isRepeat)
            // audio.play();
        }
        //xử lý khi kết thúc một bài hát
        audio.onended= function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                next.click();
            }
            audio.play();
        }
        //lắng nghe hành vi click vào playlist
        playlist.onclick= function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode|| e.target.closest('.option')){
                if(songNode){
                    _this.currenIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }else if(e.target.closest('.option')){

                }
            }
        }
    },

    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong() {
        this.currenIndex++;
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0;
        }
        this.loadCurrentSong();
    },
    playRandomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currenIndex)
        this.currenIndex = newIndex;
        this.loadCurrentSong();
    },
    prevSong() {
        this.currenIndex--;
        if (this.currenIndex < 0) {
            this.currenIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    scrollToActiveSong() {
        setTimeout(function(){
            if(app.currenIndex===0||app.currenIndex===1||app.currenIndex===2){
                
                $('.song.active').scrollIntoView({
                    behavior:'smooth',
                    block:'end'
                })// nếu index bài hát là 0 hoặc 1 hoặc 2 => dùng scrollIntoView để thẻ div có class '.song .active' cuộn 
                //lên trên View behavior = hành vi
                //block = khối hiện lên View nằm ở đâu 
                
                
            }else{
                $('.song.active').scrollIntoView({
                    behavior:'smooth',
                    block:'nearest'
                })
            }
            
        },100);
    },
    start: function () {
        //định nghĩa các thuộc tính cho object
        this.defineProperty();
        //tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // xử lý các sự kiện (Dom Event)
        this.handleEvent();

        //render playlist
        this.render();

    }

}
app.start();
