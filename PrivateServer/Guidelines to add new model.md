## Creating Model Class

<!-- MUST DO: Only take model_config dict in the constrctor of model cls,
everything req to create model should be in that dict only-->

1. Create model class with fit, get_parameters, update_parameters, predict methods
2. get_parameters should return something like this (crucial to work aggreagation correctly):
   {
   'weights': [[weights_of_layer_i], [weights_of_layer_i+1],... [weights_of_layer_i+k]],
   'biases' : [[bias_L1],...[bias_Lk]],
   'Key3;: [value/values],
   ..so on for all required keys
   }

   // for e.g. NN can have only 'weights' key as biases are included in that and nothing else is required

3. update parameters will also get a "list" (exactly like return value of get_parameters) as argument,
   it should convert it to numpy array and consume it to update model weights

4. it is advised to take the params from get_parameters and see seperately if aggregate fun works for this .. then only keep it
   in main code

5. must test get_parameters, and update_parameters to work properly with each other and aggregate function

---

## Creating Model Component to display on request page

1. create a model component such that it should return a obj ({}) having each arg required to instantiate the model obj.
   #### Note- During instantiating the model, This obj ({}) will be passed directly to your model class name so the obj must contain every relavnt field otherwise model instatiation will give an error.

---

## Linking the new model to Client Application (Note: Your model file should be in the CustomModels folder)

1. On request page add this model name and it's component in "availableModels" variable
2. list your model name along with the respective model class in the dict model_classes specified in the "PrivateServer\ModelBuilder.py" file (include the imports in the same file)

---
