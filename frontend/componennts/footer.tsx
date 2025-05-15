
export interface FooterProps {
    preText?: string;
    styles?: React.CSSProperties;
};

export const Footer = (props: FooterProps) => {
    const { preText = '内容均由AI生成，请注意辨别', styles } = props;
    return <footer className="mt-auto text-center py-2 text-xs" style={styles}>
        {preText} |
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none', fontSize: '12px' }}> 沪ICP备2024100270号-1</a>
    </footer>
}