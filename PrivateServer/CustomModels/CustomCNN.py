import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Conv2D, Reshape, MaxPooling2D, AveragePooling2D
import logging

# Setup basic logging configuration
logging.basicConfig(level=logging.ERROR, format='%(asctime)s %(levelname)s:%(message)s')


def handle_error(error):
    error_message = f"An error occurred: {error}"
    logging.error(error_message)
    # to Add custom error handling logic here


class CustomCNN:
    def __init__(self, config):
        self.config = config
        self.model = Sequential()

        try:
            input_shape = eval(config['input_shape'])

            # Adding layers to the model
            for i in range(len(config['layers'])):
                layer = config['layers'][i]
                layer_type = layer['layer_type']

                if layer_type == 'dense':
                    self.model.add(Dense(int(layer['num_nodes']), activation=layer['activation_function']))
                elif layer_type == 'flatten':
                    self.model.add(Flatten())
                elif layer_type == 'convolution':
                    self.model.add(Conv2D(
                        int(layer['filters']),
                        kernel_size=eval(layer['kernel_size']),
                        strides=eval(layer['stride']),
                        activation=layer['activation_function'],
                        input_shape=input_shape if i == 0 else None
                    ))
                elif layer_type == 'reshape':
                    self.model.add(Reshape(eval(layer['target_shape'])))
                elif layer_type == 'pooling':
                    if layer["pooling_type"]=="max":
                        self.model.add(MaxPooling2D(pool_size=eval(layer['pool_size']), strides=eval(layer['stride'])))
                    elif layer["pooling_type"]=="average":
                        self.model.add(AveragePooling2D(pool_size=eval(layer['pool_size']), strides=eval(layer['stride'])))

            output_layer = config['output_layer']
            self.model.add(Dense(int(output_layer['num_nodes']), activation=output_layer['activation_function']))

            self.model.compile(loss=config['loss'], optimizer=config['optimizer'])

        except Exception as e:
            handle_error(e)

    def fit(self, X, y, epochs=1, batch_size=32):
        try:
            return self.model.fit(X, y, epochs=epochs, batch_size=batch_size)
        except Exception as e:
            handle_error(e)

    def predict(self, X):
        try:
            return self.model.predict(X)
        except Exception as e:
            handle_error(e)

    def get_parameters(self):
        try:
            params = {'weights':[]}
            for i, layer in enumerate(self.model.layers):
                layer_weights = layer.get_weights()
                params['weights'].append(list(layer_weights))
            return params
        except Exception as e:
            handle_error(e)

    def update_parameters(self, new_params):
        try:
            for i, (layer, layer_params) in enumerate(zip(self.model.layers, new_params['weights'])):
                layer.set_weights([tf.convert_to_tensor(w) for w in layer_params])
        except Exception as e:
            handle_error(e)
