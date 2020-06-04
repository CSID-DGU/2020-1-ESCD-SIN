import os, random
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto import Random
from click._compat import raw_input
import base64

def encrypt(key, filename):
        chunksize = 64 * 1024
        outputFile = "(encrypted)" + filename
        filesize = str(os.path.getsize(filename)).zfill(16)
        IV = Random.new().read(16)

        encryptor = AES.new(key, AES.MODE_CBC, IV)

        with open(filename, 'rb') as infile:
            with open(outputFile, 'wb') as outfile:
                outfile.write(filesize.encode('utf-8'))
                outfile.write(IV)
                
                while True:
                    chunk = infile.read(chunksize)
                    
                    if len(chunk) == 0:
                        break
                    elif len(chunk) % 16 != 0:
                        chunk += b' ' * (16 - (len(chunk) % 16))

                    outfile.write(encryptor.encrypt(chunk))
def decrypt(key, filename):
        chunksize = 64*1024
        outputFile = filename[11:]
        
        with open(filename, 'rb') as infile:
            filesize = int(infile.read(16))
            IV = infile.read(16)

            decryptor = AES.new(key, AES.MODE_CBC, IV)

            with open(outputFile, 'wb') as outfile:
                while True:
                    chunk = infile.read(chunksize)

                    if len(chunk) == 0:
                        break

                    outfile.write(decryptor.decrypt(chunk))
                outfile.truncate(filesize)
def getKey(password):
            hasher = SHA256.new(password.encode('utf-8'))
            return hasher.digest()

def Main():
    # choice = raw_input("Would you like to (E)ncrypt or (D)ecrypt?: ")

    # if choice == 'E':
    #     filename = raw_input("File to encrypt: ")
    #     password = raw_input("Password: ")
    #     encrypt(getKey(password), filename)
    #     print ("Done.")
    # elif choice == 'D':
    #     filename = raw_input("File to decrypt: ")
    #     password = raw_input("Password: ")
    #     decrypt(getKey(password), filename)
    #     print ("Done.")
    # else:
    #     print ("No Option selected, closing...")
    msg_text = b'Dongguk'.rjust(32)
    secret_key = b'Sixteen byte key'

    cipher = AES.new(secret_key,AES.MODE_ECB) # never use ECB in strong systems obviously
    encoded = base64.b64encode(cipher.encrypt(msg_text))
    print(encoded)
    decoded = cipher.decrypt(base64.b64decode(encoded))
    print(decoded)

if __name__ == '__main__':
	Main()