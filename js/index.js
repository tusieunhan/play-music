const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name : 'Happy For You',
            singer: 'Vũ',
            path : './music/song1.mp3',
            image :'./img/anh1.jpg'
        },
        {
            name : 'Sâu Hồng Gai',
            singer: 'GR5',
            path : './music/song2.mp3',
            image :'./img/anh2.jpg'
        },
        {
            name : 'Summer Time',
            singer: 'K39',
            path : './music/song3.mp3',
            image :'./img/anh3.jpg'
        },
        {
            name : 'Bad liar',
            singer: 'Imagine Dragos',
            path : './music/song4.mp3',
            image :'./img/anh4.jpg'
        },
        {
            name : 'Happy For You',
            singer: 'Vũ',
            path : './music/song1.mp3',
            image :'./img/anh1.jpg'
        },
        {
            name : 'Sâu Hồng Gai',
            singer: 'GR5',
            path : './music/song2.mp3',
            image :'./img/anh2.jpg'
        },
        {
            name : 'Summer Time',
            singer: 'K39',
            path : './music/song3.mp3',
            image :'./img/anh3.jpg'
        },
        {
            name : 'Bad liar',
            singer: 'Imagine Dragos',
            path : './music/song4.mp3',
            image :'./img/anh4.jpg'
        },
    ],
    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        // console.log(htmls);
        playlist.innerHTML = htmls.join(''); 
    },

    defineProperties: function(){
        Object.defineProperty(this,'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth

        // xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate({
            transform: 'rotate(360deg)'
        }, {
            duration: 10000 ,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // xử lí phóng to thu nhỏ
        document.onscroll = function(){
            // console.log(newcdWidth);

            const scollTop = window.scrollY || document.documentElement.scrollTop
            const newcdWidth = cdWidth - scollTop

            cd.style.width =  newcdWidth > 0 ? newcdWidth  + 'px' : 0
            cd.style.opacity = cdWidth/ 200
        }

        // xử lí chơi nhạc
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
           
        }
        // song khi được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        
        // song khi bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        // Khi time bài hay thay đổi
        audio.ontimeupdate = function(){
            if( audio.duration){
                const progressPercent = Math.floor(audio.currentTime/ audio.duration *100)
                progress.value = progressPercent;
            }
        }
        // xử lí tua song
        progress.onchange = function(e){
            const seektime = audio.duration / 100 * e.target.value
            audio.currentTime = seektime
        }
        // xử lí khi next
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play();
            _this.render()
            _this.scollActiveSong()

        }
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scollActiveSong()

        }

        // xử lí random nhạc
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Xử lí khi kết thúc bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // xử lí phát lại 1 bài
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                } 

            }
        }
    },
    
    loadCurrentSong: function(){

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        // console.log(heading,cdThumb,audio)
    },

    scollActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        },300)
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length ){
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let NewIndex
        do{
            NewIndex = Math.floor(Math.random() * this.songs.length)
        } while(NewIndex === this.currentIndex)
        this.currentIndex = NewIndex
        this.loadCurrentSong()
    },

    start: function(){
        // định nghĩa các thuộc tính cho object
        this.defineProperties()
        // Lắng nghe/ xử lí các sự kiện
        this.handleEvents()
        //Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong()
        //render Platlist
        this.render()
    }
}
app.start()


