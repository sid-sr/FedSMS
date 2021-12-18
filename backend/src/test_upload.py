from common.util import upload_model_tfjs
from keras.models import Sequential
from keras.layers import Dense

if __name__ == "__main__":
    model = Sequential()
    model.add(Dense(8, activation="relu", input_shape=(4, )))
    model.add(Dense(2))
    model.compile('adam', loss='softmax_crossentropy', metrics=['accuracy'])

    print(model.summary())

    if upload_model_tfjs(model, "fedmodelbucket"):
        print("Upload successful!")
    else:
        print("An error occurred.")
