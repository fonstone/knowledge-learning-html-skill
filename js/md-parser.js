function mdParse(src) {
    if (!src) return '';
    var html = '';
    var blocks = splitBlocks(src);

    for (var b = 0; b < blocks.length; b++) {
        html += parseBlock(blocks[b]);
    }
    return html;

    function splitBlocks(s) {
        var raw = s.replace(/\r\n?/g, '\n');
        var blocks = [];
        var lines = raw.split('\n');
        var current = [];
        var inFence = false;

        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            if (l.trim().match(/^```/)) {
                current.push(l);
                inFence = !inFence;
                continue;
            }
            if (inFence) {
                current.push(l);
                continue;
            }
            if (l.trim() === '' && current.length > 0) {
                blocks.push(current.join('\n'));
                current = [];
            } else if (l.trim() !== '') {
                current.push(l);
            }
        }
        if (current.length > 0) blocks.push(current.join('\n'));
        return blocks;
    }

    function parseBlock(block) {
        var trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.match(/^</)) return block + '\n';

        var lines = block.split('\n');

        if (lines.length === 1 && trimmed.match(/^(?:---|\*\*\*|___)$/)) {
            return '<hr>\n';
        }

        var out = '';
        var i = 0;

        while (i < lines.length) {
            var raw = lines[i];
            var line = raw.trim();
            if (!line) { i++; continue; }

            var h = line.match(/^(#{1,6})\s+(.+)$/);
            if (h) {
                out += parseHeading(h[1], h[2]);
                i++;
                continue;
            }

            var bqm = line.match(/^>\s?(.*)$/);
            if (bqm) {
                var bqLines = [];
                while (i < lines.length) {
                    var bqLine = lines[i].trim();
                    var bqm2 = bqLine.match(/^>\s?(.*)$/);
                    if (bqm2) {
                        bqLines.push(bqm2[1]);
                        i++;
                    } else if (!bqLine) {
                        i++;
                        break;
                    } else {
                        break;
                    }
                }
                out += '<blockquote><p>' + bqLines.map(function (l) { return inline(l); }).join('<br>') + '</p></blockquote>\n';
                continue;
            }

            if (line.match(/^\|/)) {
                var tblLines = [];
                while (i < lines.length && lines[i].trim().match(/^\|/)) {
                    tblLines.push(lines[i]);
                    i++;
                }
                out += parseTable(tblLines);
                continue;
            }

            if (line.match(/^```/)) {
                var lang = line.slice(3).trim();
                var codeLines = [];
                i++;
                while (i < lines.length && !lines[i].trim().match(/^```/)) {
                    codeLines.push(lines[i]);
                    i++;
                }
                i++;
                out += '<pre><code' + (lang ? ' class="language-' + lang + '"' : '') + '>' + esc(codeLines.join('\n')) + '</code></pre>\n';
                continue;
            }

            if (line.match(/^[-*+]\s+/) || line.match(/^\d+\.\s+/)) {
                var lstLines = [];
                while (i < lines.length) {
                    var ll = lines[i].trim();
                    if (!ll || ll.match(/^#{1,6}\s+/) || ll.match(/^```/) || ll.match(/^\|/) || ll.match(/^>\s/)) break;
                    lstLines.push(lines[i]);
                    i++;
                }
                out += parseList(lstLines.join('\n'));
                continue;
            }

            var paraLines = [];
            while (i < lines.length) {
                var pl = lines[i].trim();
                if (!pl || pl.match(/^#{1,6}\s+/) || pl.match(/^```/) || pl.match(/^\|/) || pl.match(/^(?:---|\*\*\*|___)$/) || pl.match(/^>\s/) || pl.match(/^[-*+]\s+/) || pl.match(/^\d+\.\s+/)) break;
                paraLines.push(inline(pl));
                i++;
            }
            if (paraLines.length > 0) {
                out += '<p>' + paraLines.join('\n') + '</p>\n';
            }
        }

        return out;

        function parseHeading(markers, content) {
            var level = markers.length;
            var id = content.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '');
            return '<h' + level + ' id="' + id + '">' + inline(content) + '</h' + level + '>\n';
        }
    }

    function parseTable(lines) {
        if (lines.length < 2) return '';
        var headers = lines[0].split('|').filter(Boolean).map(function (c) { return inline(c.trim()); });
        var out = '<table><thead><tr>';
        for (var ih = 0; ih < headers.length; ih++) out += '<th>' + headers[ih] + '</th>';
        out += '</tr></thead><tbody>';
        for (var r = 2; r < lines.length; r++) {
            var cells = lines[r].split('|').filter(Boolean).map(function (c) { return inline(c.trim()); });
            if (cells.length) {
                out += '<tr>';
                for (var ic = 0; ic < cells.length; ic++) out += '<td>' + cells[ic] + '</td>';
                out += '</tr>';
            }
        }
        return out + '</tbody></table>\n';
    }

    function parseList(block) {
        var lines = block.split('\n');
        var out = '';
        var listType = null;
        var listStack = [];

        for (var li = 0; li < lines.length; li++) {
            var l = lines[li];
            var indent = l.search(/\S/);
            var depth = Math.floor(indent / 2);
            var content = '';

            var ulm = l.trim().match(/^[-*+]\s+(.+)$/);
            var olm = l.trim().match(/^\d+\.\s+(.+)$/);
            if (ulm) { listType = 'ul'; content = ulm[1]; }
            else if (olm) { listType = 'ol'; content = olm[1]; }
            else continue;

            while (listStack.length > depth) {
                var t = listStack.pop();
                out += '</' + t + '>\n';
            }
            if (listStack.length === 0 || listStack[listStack.length - 1] !== listType) {
                listStack.push(listType);
                out += '<' + listType + '>\n';
            }
            out += '<li>' + inline(content) + '</li>\n';
        }
        while (listStack.length) {
            var t2 = listStack.pop();
            out += '</' + t2 + '>\n';
        }
        return out;
    }

    function inline(s) {
        s = s.replace(/\\`/g, '\x00BT\x00')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\x00BT\x00/g, '`')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/__([^_]+)__/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/_([^_]+)_/g, '<em>$1</em>')
            .replace(/~~([^~]+)~~/g, '<del>$1</del>')
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        return s;
    }

    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
