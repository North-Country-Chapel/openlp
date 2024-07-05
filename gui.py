import tkinter as tk
import paramiko
import os
from dotenv import load_dotenv

load_dotenv()

def eff5():
    session = paramiko.SSHClient()
    session.load_system_host_keys()
    session.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    key_location = os.getenv("KEYLOCATION")
    keyfile = paramiko.RSAKey.from_private_key_file(key_location)

    session.connect(hostname=os.getenv("HOST"), username=os.getenv("USER"), pkey=keyfile)

    stdin, stdout, stderr = session.exec_command('./eff5.sh')

    session.close()


root = tk.Tk()
root.title("Refresh Browser")
root.geometry("400x200")

submit_button = tk.Button(root,text="Refresh", command=eff5)
submit_button.pack()

root.mainloop()

