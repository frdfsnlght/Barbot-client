<script>

export default {
  name: 'AudioPlayer',
  
  props: {
    volumeFile: {
      type: String,
      default: 'volume.wav',
    }
  },
  
  data: () => ({
    volume: 1,
  }),

  methods: {
    play(file) {
      let audio = new Audio(this.$socket.io.uri + '/audio/' + file)
      audio.volume = this.volume
      audio.play()
    },
    
    setVolume(volume, play = true) {
      this.volume = volume
      if (play) this.play(this.volumeFile)
    }
  },
  
  sockets: {
    playAudio(file) {
      this.play(file)
    },
  },
  
  render: function(h) {
    return h()
  }
}

</script>
