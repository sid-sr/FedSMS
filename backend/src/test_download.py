from common.util import download_files_s3

if __name__ == "__main__":

    clients = 4
    round_no = 0

    if download_files_s3(f"round_{round_no}/", "./src/data/clientmodels/", "clientmodelbucket"):
        print("Download successful!")
    else:
        print("An error occurred.")
