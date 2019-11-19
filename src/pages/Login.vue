<template>
  <q-page class="q-pa-md" style="background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">{{$t('create.heading')}}</div>
      </q-card-section>

      <q-tabs v-model="mode" class="text-grey text-medium" align="left"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
          >
        <q-tab v-for="mode of modes" :key="mode"
        :label="$t('create.' + mode)" :name="mode" />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="mode" animated>
        <q-tab-panel name="create">
            <vue-markdown :html="false" :source="$t('create.new_text')"></vue-markdown>
            <!-- Form -->
            <q-form>

              <!-- Email address -->
              <div class="form-group my-5">

                <q-field borderless :label="$t('resource.mnemonics_words')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{mnemonics}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.private_key')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{private_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.public_key')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{public_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.address')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{address}}</code>
                  </template>
                </q-field>
              </div>

              <!-- Submit -->
              <q-btn class="btn btn-lg btn-block q-mx-sm q-my-md" push color="secondary" v-on:click="generate">
                {{$t('actions.regenerate')}}
              </q-btn>
              <q-btn class="btn btn-lg btn-block  q-mx-sm q-my-md" push color="primary" v-on:click="add">
                {{$t('actions.add_it')}}
              </q-btn>

            </q-form>
        </q-tab-panel>
        <q-tab-panel name="import_mnemonics">
          <div>
            <vue-markdown :html="false" :source="$t('create.import_text')"></vue-markdown>
          </div>
            <!-- Form -->
          <q-form>

            <q-input
              v-model="mnemonics"
              :label="$t('resource.mnemonics_words')"
              v-on:input="analyze"
              lazy-rules
              :rules="[mnemoState]"
            />

                <q-field borderless :label="$t('resource.private_key')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{private_key||'--'}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.public_key')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{public_key||'--'}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.address')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{address||'--'}}</code>
                  </template>
                </q-field>

            <!-- Submit -->
            <q-btn class="btn btn-lg btn-block btn-primary mb-3" push :color="prvState()===true ? 'primary' : 'grey'"
            :disable="prvState()!==true" v-on:click="add">
              {{$t('actions.add_it')}}
            </q-btn>
          </q-form>
        </q-tab-panel>
        <q-tab-panel name="import_privkey">
          <div>
            <vue-markdown :html="false" :source="$t('create.import_text')"></vue-markdown>
          </div>
            <!-- Form -->
          <q-form>

            <q-input
              v-model="private_key"
              :label="$t('resource.private_key')"
              v-on:input="analyze"
              lazy-rules
              :rules="[prvState]"
            />
                <q-field borderless :label="$t('resource.public_key')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{public_key||'--'}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.address')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{address||'--'}}</code>
                  </template>
                </q-field>

            <!-- Submit -->
            <q-btn class="btn btn-lg btn-block btn-primary mb-3" push :color="prvState()===true ? 'primary' : 'grey'"
            :disable="prvState()!==true" v-on:click="add">
              {{$t('actions.add_it')}}
            </q-btn>
          </q-form>
        </q-tab-panel>
        <q-tab-panel name="import_encrypted_privkey">
            <div class="text-center">
              <vue-markdown :html="false" :source="$t('create.import_encrypted_text')"></vue-markdown>
            </div>
              <!-- Form -->
            <form>
              <!-- Email address -->

              <q-input
                v-model="encrypted_private_key"
                :label="$t('resource.encrypted_private_key')"
                v-on:input="analyze"
              />

              <q-input
                v-model="passphrase"
                :label="$t('resource.passphrase')"
                v-on:input="analyze" type="password"
              />

                <q-field borderless :label="$t('resource.private_key')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{private_key||'--'}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.public_key')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{public_key||'--'}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.address')" stack-label>
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{address||'--'}}</code>
                  </template>
                </q-field>
                <q-btn class="btn btn-lg btn-block btn-primary mb-3" :disabled="!prvState" v-on:click="add">
                  {{$t('actions.add_it')}}
                </q-btn>
            </form>
        </q-tab-panel>
        <q-tab-panel name="import_keystore">
          <div class="text-center">
            <vue-markdown :html="false" :source="$t('create.import_keystore_text')"></vue-markdown>
          </div>
            <!-- Form -->
          <form>
            <!-- Email address -->

            <div class="form-group my-5">

              <b-form-group
                id="name"
                :label="$t('resource.keystore_file')"
                label-for="keystore_file"
                >
                <b-input-group>
                  <b-form-file v-model="keystore_file"
                  placeholder="Choose a file..." accept="text/json, text/keystore"
                  plain @input="keystore_upload"></b-form-file>
                </b-input-group>
              </b-form-group>

            </div>
          </form>
        </q-tab-panel>
        <q-tab-panel name="import_privkey">
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import {
  nuls2
} from 'aleph-js'
console.log(nuls2)
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown'
var shajs = require('sha.js')

const secp256k1 = require('secp256k1')
const bip39 = require('bip39')
const bip32 = require('bip32')

const iv = Buffer.from('00000000000000000000000000000000', 'hex')

var webcrypto = window.crypto || window.msCrypto || window.webkitCrypto || window.mozCrypto



var hexRegEx = /([0-9]|[a-f])/gim

function isHex (input) {
  return typeof input === 'string' &&
    (input.match(hexRegEx) || []).length === input.length
}

function readFile(file){
  return new Promise((resolve, reject) => {
    console.log(file)
    var fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result )
    };
    fr.readAsText(file);
  });
}

export default {
  name: 'PageLogin',
  data () {
    return {
      // msg: 'Welcome to Your Vue.js App'
      'step': 1,
      'mode': 'create',
      'encrypted_private_key': '',
      'private_key': '',
      'passphrase': '',
      'public_key': null,
      'address': null,
      'keystore_file': null,
      'mnemonics': null,
      'modes': [
        'create',
        'import_mnemonics',
        'import_privkey',
        'import_encrypted_privkey',
        'import_keystore'//,
        //'add_view_only' // TODO: View-only not yet implemented
      ]
    }
  },
  components: {
    VueMarkdown
  },
  computed: {
      ... mapState([
        // map this.count to store.state.count
        'account',
        'network_id',
        'api_server'
      ])
  },
  watch: {
    mode() {
      this.init()
    }
  },
  methods: {
    prvState () {
        if (!isHex(this.private_key)) { return 'not hexadecimal' }
        if (!this.private_key) { return 'empty' }
        if ((this.private_key.length === 66) && (this.private_key.substring(0, 2) === '00')) {
          this.private_key = this.private_key.substring(2, 66)
          return true
        }
        if (this.private_key.length !== 64) { return 'bad length' }
        try { 
          let prvbuffer = Buffer.from(this.private_key, 'hex')
          let pub = nuls2.private_key_to_public_key(prvbuffer)
          return true
        } catch (e) {
          console.log("error with private key")
          return 'invalid'
        }
    },
    mnemoState() {
      if (this.mnemonics.trim().split(/\s+/g).length < 12) {
        return 'less than 12 words'
      }
      if (bip39.validateMnemonic(this.mnemonics))
      {
        return true
      } else {
        return 'invalid'
      }
    },
    async generate () {
    //   let randArr = new Uint8Array(32) // create a typed array of 32 bytes (256 bits)
    //   let privKey
    //   do {
    //     /// privKey = randomBytes(32)
    //     console.log('generating')
    //     window.crypto.getRandomValues(randArr)
    //     privKey = Buffer.from(randArr)
    //   } while (!secp256k1.privateKeyVerify(privKey))
    //   window.crypto.getRandomValues(randArr) // populate array with cryptographically secure random numbers
    //   this.private_key = privKey.toString('hex')

      this.mnemonics =  bip39.generateMnemonic()
      let v = await bip39.mnemonicToSeed(this.mnemonics)
      let b = bip32.fromSeed(v)
      this.private_key = b.privateKey.toString('hex')
      this.analyze()
    },
    async analyze () {
      if (this.mode == 'import_mnemonics') {
        if (this.mnemoState()===true) {
          let v = await bip39.mnemonicToSeed(this.mnemonics)

          let b = bip32.fromSeed(v)
          this.private_key = b.privateKey.toString('hex')
        }
      } else if (this.mode == 'import_encrypted_privkey') {
        let sha =  new shajs.sha256().update(Buffer.from(this.passphrase)).digest()
        try {
          let key = await webcrypto.subtle.importKey(
              "raw",
              sha,
              { name: "AES-CBC" },
              true,
              ["encrypt", "decrypt"]
          )
          let out = await webcrypto.subtle.decrypt(
              { name: "AES-CBC", iv: iv },
              key, //from generateKey or importKey above
              Buffer.from(this.encrypted_private_key, 'hex') //ArrayBuffer of data you want to encrypt
          )
          this.private_key = Buffer.from(out).toString('hex')
        } catch(error) {
          this.private_key = ''
        }
      }
      if (this.prvState() === true) {
        let prvbuffer = Buffer.from(this.private_key, 'hex')
        let pub = nuls2.private_key_to_public_key(prvbuffer)
        let hash = nuls2.public_key_to_hash(pub, {
          chain_id: this.network_id
        })
        let address = nuls2.address_from_hash(hash)
        // Vue.set(this, 'public_key', pub);
        this.public_key = pub.toString('hex')
        this.address_hash = hash.toString('hex')
        this.address = address
      } else {
        this.public_key = null
        this.address_hash = null
        this.address = null
      }
    },
    async init () {
      this.encrypted_private_key = ''
      this.passphrase = ''
      this.private_key = ''
      this.mnemonics = ''
      this.public_key = null
      this.address = null

      if (this.mode == 'create')
        await this.generate()
    },
    async add () {
      this.$store.dispatch(
        'store_account',
        await nuls2.import_account({
          'private_key': this.private_key,
          'mnemonics': this.mnemonics
        })
      )
      // this.$store.commit('set_account', {
      //   'name': this.address,
      //   'type': 'NULS',
      //   'private_key': this.private_key,
      //   'public_key': this.public_key,
      //   'address': this.address
      // })
      await this.$fetch_profile(this.address)
      this.$router.push('/')
    },
    async keystore_upload() {
      let result = await readFile(this.keystore_file)
      let keystore = JSON.parse(result)

      if ((keystore.prikey !== undefined) && (keystore.prikey !== '') && (keystore.prikey !== null)) {
        this.mode = 'import_privkey'
        await this.$forceUpdate()
        this.private_key = keystore.prikey
      } else if ((keystore.encryptedPrivateKey !== undefined) && (keystore.encryptedPrivateKey !== '') && (keystore.encryptedPrivateKey !== null)) {
        this.mode = 'import_encrypted_privkey'
        await this.$forceUpdate()
        this.encrypted_private_key = keystore.encryptedPrivateKey
      }
    }
  },
  async mounted () {
    await this.init()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="scss">
// @import 'node_modules/bootstrap/scss/bootstrap';
// @import 'node_modules/bootstrap-vue/src/index.scss';
</style>
