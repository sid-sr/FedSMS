from common.util import download_tfjs_model
import numpy as np

# model = load_model('./src/data/mock/model_3.h5')
# model.compile(optimizer='adam', loss='binary_crossentropy')


def eval_global_model(model, test_data, test_labels):
    return ((model.predict(test_data) > 0.5).ravel() == test_labels).mean(), \
        model.evaluate(test_data, test_labels)


if __name__ == "__main__":

    clients = 4
    round_no = 0

    path = './src/data/mock/global/'
    with open(path + 'test_dataset.npy', 'rb') as f:
        test_x = np.load(f)
    with open(path + 'test_labels.npy', 'rb') as f:
        test_y = np.load(f)

    print(test_x.shape, test_y.shape)
    #print(eval_global_model(test_x, test_y))
    global_model = download_tfjs_model('fedmodelbucket')
    global_model.compile(optimizer='adam', loss='binary_crossentropy')
    global_model.summary()
    print(eval_global_model(global_model, test_x, test_y))

    # if download_files_s3(f"round_{round_no}/", "./src/data/clientmodels/", "clientmodelbucket"):
    #     print("Download successful!")
    # else:
    #     print("An error occurred.")
