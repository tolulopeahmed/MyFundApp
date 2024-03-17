from cryptography.fernet import Fernet
import binascii

# Load the secret key securely
SECRET_KEY = "9e66k4wzJzPS3CH2VelpoF-XnWNaFBkUsu0tN-lwrFE="

# Create an instance of the Fernet cipher
cipher_suite = Fernet(SECRET_KEY)


def encrypt_data(data):
    data = data.encode("utf-8")
    encrypted_data = cipher_suite.encrypt(data)
    return encrypted_data


def decrypt_data(encrypted_data):
    decrypted_data = cipher_suite.decrypt(encrypted_data).decode()
    return decrypted_data
