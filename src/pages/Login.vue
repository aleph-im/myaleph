<template>
  <div class="col q-pa-md">

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

                <!-- Label -->
                <label>{{$t('resource.private_key')}}</label>
                <code class="d-block text-truncate my-2">{{private_key}}</code>

                <label>{{$t('resource.public_key')}}</label>
                <code class="d-block text-truncate my-2">{{public_key}}</code>

                <label>{{$t('resource.address')}}</label>
                <code class="d-block text-truncate my-2">{{address}}</code>

              </div>

              <!-- Submit -->
              <button class="btn btn-lg btn-block btn-primary mb-3" v-on:click="generate">
                {{$t('actions.regenerate')}}
              </button>
              <button class="btn btn-lg btn-block btn-primary mb-3" v-on:click="add">
                {{$t('actions.add_it')}}
              </button>

            </q-form>
        </q-tab-panel>
        <q-tab-panel name="import_privkey">
          <div class="text-center">
            <vue-markdown :html="false" :source="$t('create.import_text')"></vue-markdown>
          </div>
            <!-- Form -->
          <q-form>

            <q-input
              filled
              v-model="name"
              :label="$t('resource.private_key')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />


              <b-form-group
                :label="$t('resource.private_key')"
                label-for="private_key"
                :state="prvState"
            >
                <b-form-textarea id="private_key" :state="prvState"
                              v-model="private_key"
                              v-on:input="analyze"
                              :maxlength="66"
                              :rows="1"></b-form-textarea>
              </b-form-group>

              <label>{{$t('resource.public_key')}}</label>
              <code class="d-block text-truncate">{{public_key||'--'}}</code>

              <label>{{$t('resource.address')}}</label>
              <code class="d-block text-truncate">{{address||'--'}}</code>

            <!-- Submit -->
            <q-btn class="btn btn-lg btn-block btn-primary mb-3" :disabled="!prvState" v-on:click="add">
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

              <div class="form-group my-5">

                  <b-form-group
                    :label="$t('resource.encrypted_private_key')"
                    label-for="encrypted_private_key"
                >
                    <b-form-textarea id="encrypted_private_key"
                                  v-model="encrypted_private_key"
                                  v-on:input="analyze"
                                  :rows="1"></b-form-textarea>
                  </b-form-group>

                  <b-form-group
                    :label="$t('resource.passphrase')"
                    label-for="passphrase"
                    :state="prvState"
                >
                    <b-form-input id="passphrase"
                                  v-model="passphrase"
                                  v-on:input="analyze"
                                  :state="prvState"
                                  type="password"></b-form-input>
                  </b-form-group>

                  <!-- Label -->
                  <label>{{$t('resource.private_key')}}</label>
                  <code class="d-block text-truncate">{{private_key||'--'}}</code>

                  <label>{{$t('resource.public_key')}}</label>
                  <code class="d-block text-truncate">{{public_key||'--'}}</code>

                  <label>{{$t('resource.address')}}</label>
                  <code class="d-block text-truncate">{{address||'--'}}</code>
              </div>
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
    <div id="content">
      <div class="row justify-content-center">
        <div class="col-10 my-5 p-5">

          <!-- Heading -->
          <h1 class="display-4 mb-3">
            {{$t('create.heading')}}
          </h1>

          <b-form-select v-model="mode" class="my-4" size="lg">
            <option v-for="mode of modes" :value="mode" :key="mode">
              {{$t('create.' + mode)}}
            </option>
          </b-form-select>

          <div v-if="mode == 'create'">
            <div class="text-center">
              <vue-markdown :html="false" :source="$t('create.new_text')"></vue-markdown>
            </div>
            <!-- Form -->
            <form>

              <!-- Email address -->
              <div class="form-group my-5">

                <!-- Label -->
                <label>{{$t('resource.private_key')}}</label>
                <code class="d-block text-truncate my-2">{{private_key}}</code>

                <label>{{$t('resource.public_key')}}</label>
                <code class="d-block text-truncate my-2">{{public_key}}</code>

                <label>{{$t('resource.address')}}</label>
                <code class="d-block text-truncate my-2">{{address}}</code>

              </div>

              <!-- Submit -->
              <button class="btn btn-lg btn-block btn-primary mb-3" v-on:click="generate">
                {{$t('actions.regenerate')}}
              </button>
              <button class="btn btn-lg btn-block btn-primary mb-3" v-on:click="add">
                {{$t('actions.add_it')}}
              </button>

            </form>
          </div>

          <div v-if="mode == 'import_privkey'">
            <div class="text-center">
              <vue-markdown :html="false" :source="$t('create.import_text')"></vue-markdown>
            </div>
              <!-- Form -->
            <form>
              <!-- Email address -->
              <div class="form-group my-5">

                <b-form-group
                  :label="$t('resource.private_key')"
                  label-for="private_key"
                  :state="prvState"
              >
                  <b-form-textarea id="private_key" :state="prvState"
                                v-model="private_key"
                                v-on:input="analyze"
                                :maxlength="66"
                                :rows="1"></b-form-textarea>
                </b-form-group>

                <label>{{$t('resource.public_key')}}</label>
                <code class="d-block text-truncate">{{public_key||'--'}}</code>

                <label>{{$t('resource.address')}}</label>
                <code class="d-block text-truncate">{{address||'--'}}</code>

              </div>

              <!-- Submit -->
              <button class="btn btn-lg btn-block btn-primary mb-3" :disabled="!prvState" v-on:click="add">
                {{$t('actions.add_it')}}
              </button>
          </form>
          </div>

          <div v-if="mode == 'import_encrypted_privkey'">
            <div class="text-center">
              <vue-markdown :html="false" :source="$t('create.import_encrypted_text')"></vue-markdown>
            </div>
              <!-- Form -->
            <form>
              <!-- Email address -->

            <div class="form-group my-5">

                <b-form-group
                  :label="$t('resource.encrypted_private_key')"
                  label-for="encrypted_private_key"
              >
                  <b-form-textarea id="encrypted_private_key"
                                v-model="encrypted_private_key"
                                v-on:input="analyze"
                                :rows="1"></b-form-textarea>
                </b-form-group>

                <b-form-group
                  :label="$t('resource.passphrase')"
                  label-for="passphrase"
                  :state="prvState"
              >
                  <b-form-input id="passphrase"
                                v-model="passphrase"
                                v-on:input="analyze"
                                :state="prvState"
                                type="password"></b-form-input>
                </b-form-group>

                <!-- Label -->
                <label>{{$t('resource.private_key')}}</label>
                <code class="d-block text-truncate">{{private_key||'--'}}</code>

                <label>{{$t('resource.public_key')}}</label>
                <code class="d-block text-truncate">{{public_key||'--'}}</code>

                <label>{{$t('resource.address')}}</label>
                <code class="d-block text-truncate">{{address||'--'}}</code>

              </div>

              <!-- Submit -->
              <button class="btn btn-lg btn-block btn-primary mb-3" :disabled="!prvState" v-on:click="add">
                {{$t('actions.add_it')}}
              </button>
          </form>
          </div>
          <div v-if="mode == 'import_keystore'">
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
          </div>
        </div>
      </div> <!-- / .row -->
    </div>
  </div>
</template>

<script>
import {
  private_key_to_public_key,
  address_from_hash,
  hash_from_address,
  public_key_to_hash
} from 'aleph-js/src/api/nuls2'
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
  name: 'add',
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
      'modes': [
        'create',
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
    prvState () {
      if (!isHex(this.private_key)) { return false }
      if (!this.private_key) { return false }
      if ((this.private_key.length === 66) && (this.private_key.substring(0, 2) === '00')) {
        this.private_key = this.private_key.substring(2, 66)
        return true
      }
      if (this.private_key.length !== 64) { return false }
      try {
        let prvbuffer = Buffer.from(this.private_key, 'hex')
        let pub = private_key_to_public_key(prvbuffer)
        return true
      } catch (e) {
        return false
      }
    },
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
    generate () {
      let randArr = new Uint8Array(32) // create a typed array of 32 bytes (256 bits)
      let privKey
      do {
        /// privKey = randomBytes(32)
        console.log('generating')
        window.crypto.getRandomValues(randArr)
        privKey = Buffer.from(randArr)
      } while (!secp256k1.privateKeyVerify(privKey))
      window.crypto.getRandomValues(randArr) // populate array with cryptographically secure random numbers
      this.private_key = privKey.toString('hex')
      this.analyze()
    },
    async analyze () {
      if (this.mode == 'import_mnemonics') {
        v = await bip39.mnemonicToSeed(this.mnemonics)

        b = bip32.fromSeed(v)
        this.private_key = b.privateKey.toString('hex')
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
      if (this.prvState) {
        let prvbuffer = Buffer.from(this.private_key, 'hex')
        let pub = private_key_to_public_key(prvbuffer)
        let hash = public_key_to_hash(pub, {
          chain_id: this.network_id
        })
        let address = address_from_hash(hash)
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
    init () {
      this.encrypted_private_key = ''
      this.passphrase = ''
      this.private_key = ''
      this.public_key = null
      this.address = null

      if (this.mode == 'create')
        this.generate()
    },
    add () {
      this.$store.commit('set_account', {
        'name': this.address,
        'type': 'NULS',
        'private_key': this.private_key,
        'public_key': this.public_key,
        'address': this.address
      })
      this.$router.push('/')
    },
    async keystore_upload() {
      console.log(this.keystore_file)
      let result = await readFile(this.keystore_file)
      console.log(result)
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
  mounted () {
    this.init()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="scss">
// @import 'node_modules/bootstrap/scss/bootstrap';
// @import 'node_modules/bootstrap-vue/src/index.scss';
</style>
