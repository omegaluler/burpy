import { BurpSession, BurpItem } from "../types/burp";

export function decodeBase64(str: string): string {
    try {
        return atob(str);
    } catch (e) {
        console.error("Failed to decode base64:", e);
        return str;
    }
}

export function urlDecode(str: string): string {
    try {
        let decoded = decodeURIComponent(str);

        if (decoded.includes("%")) {
            try {
                decoded = decodeURIComponent(decoded);
            } catch (e) {}
        }

        decoded = decoded.replace(/\+/g, " ");

        decoded = decoded
            .replace(/%20/g, " ")
            .replace(/%3D/g, "=")
            .replace(/%26/g, "&")
            .replace(/%2B/g, "+")
            .replace(/%3F/g, "?")
            .replace(/%2F/g, "/")
            .replace(/%25/g, "%")
            .replace(/%23/g, "#")
            .replace(/%3A/g, ":");

        return decoded;
    } catch (e) {
        console.error("Failed to decode URL:", e);
        return str;
    }
}

export function htmlDecode(str: string): string {
    try {
        const txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    } catch (e) {
        console.error("Failed to decode HTML:", e);
        return str;
    }
}

export function jsonFormat(str: string): string {
    try {
        const parsed = JSON.parse(str);
        return JSON.stringify(parsed, null, 4);
    } catch (e) {
        console.error("Failed to format JSON:", e);
        return str;
    }
}

export function jsonMinify(str: string): string {
    try {
        const parsed = JSON.parse(str);
        return JSON.stringify(parsed);
    } catch (e) {
        console.error("Failed to minify JSON:", e);
        return str;
    }
}

export async function parseBurpXml(xmlContent: string): Promise<BurpSession> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    const items = xmlDoc.getElementsByTagName("item");
    const parsedItems: BurpItem[] = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const getElementText = (tagName: string) =>
            item.getElementsByTagName(tagName)[0]?.textContent || "";

        const host = item.getElementsByTagName("host")[0];
        const request = item.getElementsByTagName("request")[0];
        const response = item.getElementsByTagName("response")[0];

        parsedItems.push({
            time: getElementText("time"),
            url: getElementText("url"),
            host: {
                value: host?.textContent || "",
                ip: host?.getAttribute("ip") || "",
            },
            port: getElementText("port"),
            protocol: getElementText("protocol"),
            method: getElementText("method"),
            path: getElementText("path"),
            extension: getElementText("extension"),
            request: {
                base64: request?.getAttribute("base64") === "true",
                value: getElementText("request"),
            },
            status: getElementText("status"),
            responselength: getElementText("responselength"),
            mimetype: getElementText("mimetype"),
            response: {
                base64: response?.getAttribute("base64") === "true",
                value: getElementText("response"),
            },
            comment: getElementText("comment"),
        });
    }

    return {
        burpVersion: xmlDoc.documentElement.getAttribute("burpVersion") || "",
        exportTime: xmlDoc.documentElement.getAttribute("exportTime") || "",
        items: parsedItems,
    };
}
