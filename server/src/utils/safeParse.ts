export const safeParseJSON = (text: string) => {
    try {
        const cleaned = text
            // remove think blocks
            .replace(/<think>[\s\S]*?<\/think>/g, "")
            // remove markdown
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch {
        return null;
    }
};