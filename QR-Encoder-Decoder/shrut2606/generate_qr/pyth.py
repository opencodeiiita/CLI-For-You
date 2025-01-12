import requests

def upload_to_fileio(file_path):
    
    url = "https://file.io"
    try:
        with open(file_path, 'rb') as file:
            files = {"file": file}
            response = requests.post(url, files=files)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    return data["link"]
                else:
                    return f"Error: {data.get('message', 'Unknown error')}"
            else:
                return f"Failed to upload. HTTP status code: {response.status_code}"
    except FileNotFoundError:
        return "Error: File not found. Please check the file path."
    except requests.exceptions.RequestException as e:
        return f"Network error occurred: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

if __name__ == "__main__":
    file_path = input("Enter the path to the file you want to upload: ")
    result = upload_to_fileio(file_path)
    print("Link:", result)
