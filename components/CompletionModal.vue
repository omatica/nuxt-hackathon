<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
        transition="dialog-top-transition"
        max-width="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
          >Complete Conditions</v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar
              color="primary"
              dark
            >Status</v-toolbar>
            <v-card-text>
              <div class="text-h4 pa-12">Your new condition have been saved in Candooh </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="dialog.value = false"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>