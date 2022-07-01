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

    <v-text-field
            v-model="sku"
            label="sku"
            :rules="numberRules"
            required
          ></v-text-field>

          <v-text-field
            v-model="price"
            label="price"
            :rules="numberRules"
            required
          ></v-text-field>

          <v-select
          :items="categories"
          item-text="name"
          item-value="_id"
          label="Category"
          v-model="category"
        ></v-select>
      
      
        <v-textarea
          name="input-7-1"
          v-model="description"
          label="description"
          value=""
          hint="Hint text"
          :rules="rules"
          required
        ></v-textarea>

        <v-file-input
            label="Upload images"
            v-model="images"
            counter
            show-size
            truncate-length="15"
            :rules="rules"
            required
            multiple
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
import store from './../store/index';
    export default {
        name: 'ProductDialog',
        data: ()=>({
            name: null,
            sku:null,
            price:null,
            category:null,
            description: null,
            images: null,
            valid: true,
            rules: [
            v => !!v || 'this field is required',
            ],
            numberRules: [
              v => !!v || 'this field is required',
              v => !isNaN(v) || 'the value must be a number'
            ]
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
            categories(){
                return store.state.categories;
               
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
                 formData.append("sku", this.sku);
                  formData.append("price", this.price);
                 formData.append("category", this.category);
                 formData.append("description", this.description);
                  if (this.images.length != 0) {
                  for (const single_file of this.images) {
                      formData.append('images', single_file)
                    }
                  }
                  this.func(formData, this.id);
                  this.$refs.form.reset();
                this.$emit('update-options', false)
              }
              
                
              }
            }
        }
    
</script>