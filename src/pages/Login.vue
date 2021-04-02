<template>
  <q-page class="q-pa-md" style="background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);">
    <q-card class="my-card">
      <q-card-section class="row justify-between">
        <div class="text-h6">{{$t('create.heading')}}</div>
        <q-btn-toggle
          v-model="account_type"
          push
          rounded
          toggle-color="primary"
          :options="[
            {value: 'NULS2', label: 'NULS', icon: 'img:statics/ux/nuls.svg'},
            {value: 'ETH', label: 'Ethereum', icon: 'img:statics/ux/eth.svg'}
          ]"
        >
        </q-btn-toggle>
      </q-card-section>

      <q-tabs v-model="mode" class="text-grey text-medium" align="left"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
          >
        <q-tab name='create' :label="$t('create.create')" />
        <q-tab name='import_mnemonics' :label="$t('create.import_mnemonics')" />
        <q-tab name='import_privkey' :label="$t('create.import_privkey')" />
        <q-tab name='import_encrypted_privkey' :label="$t('create.import_encrypted_privkey')"  v-if="account_type == 'NULS2'" />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="mode" animated>
        <q-tab-panel name="create">
            <vue-markdown :html="false" :source="$t('create.new_text')"></vue-markdown>
            <!-- Form -->
            <q-form>
              <!-- Email address -->
              <div class="form-group my-5">

                <q-field borderless :label="$t('resource.mnemonics_words')" stack-label v-if="tentative_account&&tentative_account.mnemonics">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.mnemonics}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.private_key')" stack-label v-if="tentative_account&&tentative_account.private_key">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.wif?tentative_account.wif:tentative_account.private_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.public_key')" stack-label v-if="tentative_account&&tentative_account.public_key">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.public_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.address')" stack-label v-if="tentative_account&&tentative_account.address">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.address}}</code>
                  </template>
                </q-field>
              </div>

              <!-- Submit -->
              <q-btn class="btn btn-lg btn-block q-mx-sm q-my-md" push color="secondary" v-on:click="generate" :loading="generating">
                {{$t('actions.regenerate')}}
              </q-btn>
              <q-btn class="btn btn-lg btn-block  q-mx-sm q-my-md" push color="primary" v-on:click="add" :loading="adding">
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

                <q-field borderless :label="$t('resource.private_key')" stack-label v-if="tentative_account&&tentative_account.private_key">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.wif?tentative_account.wif:tentative_account.private_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.public_key')" stack-label v-if="tentative_account&&tentative_account.public_key">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.public_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.address')" stack-label v-if="tentative_account&&tentative_account.address">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.address}}</code>
                  </template>
                </q-field>

            <!-- Submit -->
            <q-btn class="btn btn-lg btn-block btn-primary mb-3" push :color="tentative_account!==null ? 'primary' : 'grey'"
                 :disable="tentative_account==null" v-on:click="add" :loading="adding">
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
                <q-field borderless :label="$t('resource.public_key')" stack-label v-if="tentative_account&&tentative_account.public_key">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.public_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.address')" stack-label v-if="tentative_account&&tentative_account.address">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.address}}</code>
                  </template>
                </q-field>
            <!-- Submit -->
            <q-btn class="btn btn-lg btn-block btn-primary mb-3" push :color="tentative_account!==null ? 'primary' : 'grey'"
            :disable="tentative_account==null" v-on:click="add" :loading="adding">
              {{$t('actions.add_it')}}
            </q-btn>
          </q-form>
        </q-tab-panel>
        <q-tab-panel name="import_encrypted_privkey" v-if="account_type == 'NULS2'">
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

                <q-field borderless :label="$t('resource.private_key')" stack-label v-if="tentative_account&&tentative_account.private_key">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.wif?tentative_account.wif:tentative_account.private_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.public_key')" stack-label v-if="tentative_account&&tentative_account.public_key">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.public_key}}</code>
                  </template>
                </q-field>
                <q-field borderless :label="$t('resource.address')" stack-label v-if="tentative_account&&tentative_account.address">
                  <template v-slot:control>
                    <code class="self-center full-width no-outline text-truncate" tabindex="0">{{tentative_account.address}}</code>
                  </template>
                </q-field><q-btn class="btn btn-lg btn-block btn-primary mb-3" push :color="tentative_account!==null ? 'primary' : 'grey'"
                 :disable="tentative_account==null" v-on:click="add" :loading="adding">
                {{$t('actions.add_it')}}
                </q-btn>
            </form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import {
  nuls2, neo, ethereum
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
      'account_type': 'NULS2',
      'mode': 'import_mnemonics',
      'encrypted_private_key': '',
      'private_key': '',
      'passphrase': '',
      'public_key': null,
      'address': null,
      'keystore_file': null,
      'mnemonics': null,
      'adding': false,
      'generating': false,
      'tentative_account': null,
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
      privst() {
        return this.prvState()
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
    },
    account_type() {
      this.switch()
    }
  },
  methods: {
    async prvState () {
      await this.analyze()
      if (!this.private_key) { return 'empty' }
      if (!this.tentative_account) { return 'error' }
      return true
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
      this.generating = true;

      if (this.account_type == 'NULS2')
        this.tentative_account = await nuls2.new_account()
      else if (this.account_type == 'NEO')
        this.tentative_account = await neo.new_account()
      else if (this.account_type == 'ETH')
        this.tentative_account = await ethereum.new_account()
      this.generating = false;
    },
    async analyze () {
      try {
        if (this.mode == 'import_mnemonics') {
          if (this.mnemoState()===true) {
            if (this.account_type == 'NULS2')
              this.tentative_account = await nuls2.import_account({
                'mnemonics': this.mnemonics
              })
            else if (this.account_type == 'ETH')
              this.tentative_account = await ethereum.import_account({
                'mnemonics': this.mnemonics
              })
            else if (this.account_type == 'NEO')
              this.tentative_account = await neo.import_account({
                'mnemonics': this.mnemonics
              })
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
            this.tentative_account = await nuls2.import_account({
                'private_key': this.private_key
              })
          } catch(error) {
            this.private_key = ''
            this.tentative_account = null
          }
        } else {
          if (this.private_key) {
            if (this.account_type == 'NULS2')
              this.tentative_account = await nuls2.import_account({
                'private_key': this.private_key
              })
            if (this.account_type == 'NEO')
              this.tentative_account = await neo.import_account({
                'private_key': this.private_key
              })
            else if (this.account_type == 'ETH')
              this.tentative_account = await ethereum.import_account({
                'private_key': this.private_key
              })
          }
        }
      } catch(error) {
        console.log("woops", error)
        this.tentative_account = null
      }
    },
    async init () {
      this.encrypted_private_key = ''
      this.passphrase = ''
      this.private_key = ''
      this.mnemonics = ''
      this.public_key = null
      this.address = null
      this.tentative_account = null

      if (this.mode == 'create')
        await this.generate()
    },
    async switch() {
      if (this.mode == 'create')
        await this.generate()
      else
        await this.analyze()
    },
    async add () {
      this.adding = true
      this.$store.dispatch(
        'store_account',
        this.tentative_account
      )
      // this.$store.commit('set_account', {
      //   'name': this.address,
      //   'type': 'NULS',
      //   'private_key': this.private_key,
      //   'public_key': this.public_key,
      //   'address': this.address
      // })
      await this.$fetch_profile(this.tentative_account.address)
      this.adding = false
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
