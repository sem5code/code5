# Ansible deploy for exrp5-ansible

This folder contains a simple Ansible playbook to deploy the Node.js GraphQL app.


Quick steps (run from repository root) — simplified local Linux deploy:

1. Ensure you have Ansible installed on this machine and you're on Linux.

2. Run the playbook locally (the playbook targets `localhost` and uses `ansible_connection=local`):

```powershell
# from repository root
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

The sample inventory already contains `localhost ansible_connection=local` for quick testing.

Notes and assumptions for this simplified flow:
- Targets the local machine (no SSH required).
- No MongoDB configuration — the app will run with its in-memory store.
- App files are copied to `/opt/exrp5-ansible` and a systemd service `exrp5-ansible.service` is created and started.

If you later want a remote-server workflow or to enable MongoDB, I can update the playbook to support those options.
