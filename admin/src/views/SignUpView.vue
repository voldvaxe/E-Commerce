<template>
    <v-container class="my-10">
        <v-card class = 'mx-auto pa-10'
            elevation="4"
        > 
            <v-row>
                <v-col>
                    <div class = 'text-h3 ml-4 mb-2'>
                        Sign Up
                        </div>
                    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="firstName"
      :counter="30"
      :rules="nameRules"
      label="First Name"
      required
    ></v-text-field>

    <v-text-field
      v-model="lastName"
      :counter="30"
      :rules="nameRules"
      label="Last Name"
      required
    ></v-text-field>

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="password"
      required
      type="password"
    ></v-text-field>

    <v-text-field
      v-model="adminPassword"
      :rules="passwordRules"
      label="admin password"
      required
      type="password"
    ></v-text-field>

    <v-btn
        large
      :disabled="!valid"
      color="primary"
      class="mr-4"
      @click="submit"
    >
      Sign Up
    </v-btn>
  </v-form>
                </v-col>
                <v-col>
                    <img src="../assets/1.svg" >
                    <div align="center" class = 'mt-4'>
                        <router-link :to="{name: 'signIn'}">I am already a member</router-link>
                        </div>
                </v-col>
            </v-row>
        
        </v-card>
    </v-container>
</template>

<script>
    import axios from 'axios';
    axios.defaults.withCredentials = true;
    export default {
        name: 'SignUp',
        data: () => ({
          valid: true,
          firstName: '',
          lastName: '',
          password: '',
          email: '',
          adminPassword:'',
          nameRules: [
            v => !!v || 'Name is required',
            v => (v && (v.length > 2 && v.length < 30)) || 'Name must be more than 3 and less than 30 characters',
          ],
          emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
          ],
          passwordRules:[
            v => !!v || 'password is required',
            v => (v && v.length > 6) || 'the password is very week',
          ],
          checkbox: false,
        }),

        methods: {
          submit : async function () {
            this.$refs.form.validate()
            try {
              await axios.post('api/admin/register', {firstName: this.firstName , lastName: this.lastName,email: this.email, password: this.password, adminPassword: this.adminPassword}, {withCredentials: true});
              localStorage.setItem('firstLogin', true)
              window.location.href = "/";
            } catch (err) {
                console.log(err)
            }
          },
        },
    }
</script>