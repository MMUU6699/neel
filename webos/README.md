# webOS TV Wrapper

This folder contains the wrapper for the LG webOS TV application. It uses a Hosted Web App model where the local app is simply a loader that navigates to the production web URL of your Next.js application.

## Prerequisites

1. Install Node.js
2. Install the webOS CLI:
   ```bash
   npm install -g @webosose/ares-cli
   ```

## Development and Testing

### 1. Enable Developer Mode on the TV
1. On your LG webOS TV, go to the Content Store and search for the **Developer Mode** app. Install and launch it.
2. Sign in with your LG Developer account.
3. Turn on **Dev Mode Status** and **Key Server**.
4. Take note of the TV's IP address and the passphrase displayed on the screen.

### 2. Connect your PC to the TV
Run the setup command to add your TV as a target device:
```bash
ares-setup-device
```
- Select `add`.
- Enter a name (e.g., `tv`).
- Enter the IP address of the TV.
- Leave the port as `9922`.
- Enter `developer` for the username.

Get the key from the TV:
```bash
ares-novacom --device tv --getkey
```
(Enter the passphrase displayed on the TV when prompted).

### 3. Packaging the App
From the root of your project, run:
```bash
./scripts/webos-package.sh
```
This will generate a `.ipk` file (e.g., `com.index.tv_3.0.0_all.ipk`) in the root directory.

### 4. Sideloading to the TV
Install the generated `.ipk` file onto the connected TV:
```bash
ares-install --device tv com.index.tv_3.0.0_all.ipk
```
To launch it immediately:
```bash
ares-launch --device tv com.index.tv
```

## Submitting to LG Seller Lounge
If you want to release the app publicly on the LG Content Store:
1. Register for an LG Seller Lounge account at [seller.lgappstv.com](https://seller.lgappstv.com/).
2. Navigate to **App Management** -> **Submit App**.
3. Fill in the required metadata (App Name, Description, Categories, Supported Countries).
4. Upload the generated `.ipk` file.
5. Upload the required graphical assets (icons, screenshots).
6. Submit for QA review. LG will test the app for performance, usability, and policy compliance before publishing it.
