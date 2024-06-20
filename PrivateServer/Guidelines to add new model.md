## Creating Model Class

1. Create model class with fit, get_parameters, update_parameters, predict methods
2.

---

## Creating Model Component to display on request page

1. create a model component such that it should return a obj ({}) having each arg required to instantiate the model obj.
   #### Note- During instantiating the model, This obj ({}) will be passed directly to your model class name so the obj must contain every relavnt field otherwise model instatiation will give an error.

---

## Linking the new model to Client Application (Note: Your model file should be in the CustomModels folder)

1. On request page add this model name and it's component in "availableModels" variable
2. list your model name along with the respective model class in the dict model_classes specified in the "PrivateServer\ModelBuilder.py" file (include the imports in the same file)

---
