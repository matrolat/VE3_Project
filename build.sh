# Install Rust toolchain
curl https://sh.rustup.rs -sSf | sh -s -- -y
source $HOME/.cargo/env

# Proceed with your normal Python build
pip install -r requirements.txt
npm install --prefix task-manager-frontend
npm run build --prefix task-manager-frontend
