from CustomModels.LandMarkSVM import LandMarkSVM
from CustomModels.CustomSVM import CustomSVM
from CustomModels.LinearRegression import LinearRegression
import json

model_classes = {
        "LandMarkSVM": LandMarkSVM,
        "CustomSVM": CustomSVM,
        "Linear_Regression": LinearRegression
        # Add other models here if necessary
    }

def model_instance_from_config(modelConfig):
    model_name = modelConfig.get('model')
    config = modelConfig.get('config')

    model_class = model_classes.get(model_name)
    
    if not model_class:
        raise ValueError(f"Unknown model: {model_name}")

    model_instance = model_class(**config)
    
    return model_instance


model_instance = model_instance_from_config(modelConfig)
print(model_instance)
methods = [method_name for method_name in dir(model_instance) if callable(getattr(model_instance, method_name)) and not method_name.startswith("__")]

print(methods)

