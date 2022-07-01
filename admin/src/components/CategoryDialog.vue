<template>
    <v-row justify="center">
    <v-dialog
      v-model="$_options"
      persistent
      max-width="750"
    >
      <v-card class="pa-4">
        <div>
          <v-form  ref="form"
            v-model="valid"
            lazy-validation>
            <v-text-field
            v-model="name"
            label="Name"
            :rules="rules"
            required
          ></v-text-field>

        <v-file-input
        label="Upload an image"
        v-model="image"
            counter
            show-size
            truncate-length="15"
            :rules="rules"
            required
            ></v-file-input>

        
          <v-btn
            color="primary darken-1"
            text
            :disabled="!valid"
            @click="theFunction"
          >
            {{action}}
          </v-btn>
          <v-btn
            color="error darken-1"
            text
            @click="close"
          >
            close
          </v-btn>
        </v-form>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
    export default {
        name: 'CategoryDialog',
        data: ()=>({
            name: null,
            image: null,
            valid: true,
            rules: [
            v => !!v || 'this field is required',
            ],
            
        }),
        computed: {
            $_options: {
            get: function () {
                return this.options;
            },
            set: function (val) {
                this.$emit('update-options', val);
            }
            
            },
        },
        props:['func','options', 'id', 'action'],
        methods: {
            close () {
                console.log(this.id)
                this.$emit('update-options', false)
            },
            async theFunction(){
              const test = this.$refs.form.validate();
              if(test)
              {
                var formData = new FormData();
                formData.append("name", this.name);
                formData.append('image', this.image)
                this.func(formData, this.id);
                this.$refs.form.reset();
                this.$emit('update-options', false)
              }
              
                
              }
            }
        }
    
</script>