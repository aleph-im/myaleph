// MyUploader.js
import { QUploaderBase } from 'quasar'
import { storage_push_file, encryption, store } from 'aleph-js'
import { mapState } from 'vuex'

export default {
  name: 'aleph-uploader',

  mixins: [ QUploaderBase ],

  computed: {
    // [REQUIRED]
    // we're working on uploading files
    isUploading () {
      // return <Boolean>
      console.log("isUploading called")
    },

    // [optional]
    // shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    isBusy () {
      // return <Boolean>
      console.log("isBusy called")
    },
    ... mapState([
      // map this.count to store.state.count
      'account',
      'api_server',
      'channel',
      'balance_info',
      'mb_per_aleph'
    ])
  },

  props: {
    'encrypt': Boolean
  },

  methods: {
    // [REQUIRED]
    // abort and clean up any process
    // that is in progress
    abort () {
      // ...
    },

    // [REQUIRED]
    async upload () {
      if (this.canUpload === false) {
        return
      }

      const queue = this.queuedFiles.slice(0)
      for (let file of queue) {
        console.log(queue)

        if (this.encrypt) {
          let reader = new FileReader()

          reader.readAsBinaryString(file)
          const result = await new Promise((resolve, reject) => {
            reader.onload = function(event) {
            resolve(reader.result)
            }
          })
          let content = encryption.encrypt_for_self(
            this.account, result, {as_hex: false})

          let message = await store.submit(
            this.account.address,
            {fileobject: new Blob([content]),
             channel: this.channel,
             api_server: this.api_server,
             account: this.account})

          // let file_hash = await storage_push_file(
          //   myBlob, {api_server: this.api_server})
          file.private = true
          file.item_hash = message.content.item_hash
          file.item_type = message.content.item_type
          this.__updateFile(file, 'uploading', file.size * 0.7)
          


          this.__updateFile(file, 'uploaded')
        } else { 
          let file_hash = await storage_push_file(
            file, {api_server: this.api_server})
          this.uploadedSize += file.size
          this.__updateFile(file, 'uploading', file.size)
          this.__updateFile(file, 'uploaded')
          file.hash = file_hash
          file.engine = 'storage'
        }
      }
      this.$emit('uploaded', queue)
    //   this.queuedFiles = []
    //   if (this.xhrProps.batch(queue)) {
    //     this.__runFactory(queue)
    //   }
    //   else {
    //     queue.forEach(file => {
    //       this.__runFactory([ file ])
    //     })
    //   }
    }
  }
}