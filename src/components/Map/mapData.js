export const mapAreas = [
    // --- PIT AREA ---
    {
        id: '01',
        category: 'PIT AREA',
        name: 'Pit Area',
        nameVi: 'Khu vực Pit',
        shapes: [
            { x: 50.4, y: 32.5, width: 20.8, height: 5.6 }, // Teams 1-32
            { x: 79.5, y: 9.5, width: 9.3, height: 5.2 }   // Teams 33-41
        ],
        color: '#ec4899',
        description: 'Main Pit Area for teams 1-41',
        descriptionVi: 'Khu vực kỹ thuật chính cho các đội 1-41'
    },
    {
        id: '02',
        category: 'PIT AREA',
        name: "Sponsors' Pit",
        nameVi: 'Khu vực Nhà tài trợ',
        x: 82, y: 15, width: 6, height: 4,
        color: '#fef08a',
        description: "Sponsors' and VIP display area",
        descriptionVi: 'Khu vực trưng bày của Nhà tài trợ & VIP'
    },
    {
        id: '03',
        category: 'PIT AREA',
        name: 'Robot Hospital',
        nameVi: 'Bệnh viện Robot',
        x: 88, y: 10, width: 3, height: 4,
        color: '#a855f7',
        description: 'Technical support and repair station',
        descriptionVi: 'Trạm hỗ trợ kỹ thuật và sửa chữa robot'
    },
    {
        id: '04',
        category: 'PIT AREA',
        name: 'Pit Admin',
        nameVi: 'Bàn kỹ thuật (Admin)',
        x: 71, y: 33, width: 2, height: 4,
        color: '#fce7f3',
        description: 'Administrative support for Pit area',
        descriptionVi: 'Hỗ trợ hành chính khu vực kỹ thuật'
    },
    {
        id: '05',
        category: 'PIT AREA',
        name: 'Dining Area',
        nameVi: 'Khu vực ăn uống',
        x: 73, y: 15, width: 8, height: 15,
        points: [[0, 50], [50, 0], [100, 20], [80, 100], [20, 100]], // Curved polygon approx
        color: '#f97316',
        description: 'Designated food and beverage area',
        descriptionVi: 'Khu vực ăn uống quy định'
    },
    {
        id: '06',
        category: 'PIT AREA',
        name: 'Training Ground',
        nameVi: 'Sân tập luyện',
        x: 45, y: 22, width: 3, height: 6,
        color: '#fbbf24',
        description: 'Practice and calibration area',
        descriptionVi: 'Khu vực tập luyện và hiệu chuẩn'
    },

    // --- EVENT TENT ---
    {
        id: '07',
        category: 'EVENT TENT',
        name: 'Stage',
        nameVi: 'Sân khấu',
        x: 65, y: 70, width: 3.5, height: 12,
        color: '#d946ef',
        description: 'Main event stage for ceremonies',
        descriptionVi: 'Sân khấu chính cho các buổi lễ'
    },
    {
        id: '08',
        category: 'EVENT TENT',
        name: 'Audience Area',
        nameVi: 'Khu vực khán giả',
        x: 53, y: 71.5, width: 5, height: 9.5,
        color: '#22d3ee',
        description: 'Seating area for spectators',
        descriptionVi: 'Khu vực ghế ngồi cho khán giả'
    },
    {
        id: '09',
        category: 'EVENT TENT',
        name: 'Competition Field',
        nameVi: 'Sân thi đấu',
        x: 60.5, y: 70, width: 3.5, height: 12,
        color: '#b91c1c',
        description: 'Official competition fields 1 & 2',
        descriptionVi: 'Sân thi đấu chính thức 1 & 2'
    },
    {
        id: '10',
        category: 'EVENT TENT',
        name: 'Team Queuing Area',
        nameVi: 'Khu vực chờ thi đấu',
        shapes: [
            { x: 60.5, y: 67, width: 1.5, height: 2 }, // Left blue box above fields
            { x: 62.3, y: 67, width: 1.5, height: 2 }  // Right blue box above fields
        ],
        color: '#2563eb',
        description: 'Teams waiting for their match',
        descriptionVi: 'Khu vực chờ gọi tên thi đấu'
    },
    {
        id: '11',
        category: 'EVENT TENT',
        name: 'Screen',
        nameVi: 'Màn hình',
        shapes: [
            { x: 63.8, y: 70, width: 1.2, height: 1.5 }, // Left green box in front of stage
            { x: 63.8, y: 80.5, width: 1.2, height: 1.5 } // Right green box in front of stage
        ],
        color: '#84cc16',
        description: 'Event display screens',
        descriptionVi: 'Màn hình sự kiện'
    },
    {
        id: '12',
        category: 'EVENT TENT',
        name: 'FOH',
        nameVi: 'Khu kỹ thuật hình ảnh/âm thanh',
        x: 57.8, y: 67.8, width: 1.6, height: 1.3, // Yellow rectangle
        color: '#fdba74',
        description: 'Front of House - Audio/Visual control',
        descriptionVi: 'Điều khiển âm thanh và hình ảnh'
    },
    {
        id: '13',
        category: 'EVENT TENT',
        name: 'Technical Area',
        nameVi: 'Khu vực kỹ thuật',
        x: 59.4, y: 67.8, width: 1.1, height: 1.3, // Red rectangle next to FOH
        color: '#f87171',
        description: 'Technical support area',
        descriptionVi: 'Khu vực kỹ thuật'
    },
    {
        id: '14',
        category: 'EVENT TENT',
        name: 'Judge Area',
        nameVi: 'Khu vực Giám khảo',
        x: 58, y: 70, width: 2.5, height: 12.2, // Purple vertical rectangle
        color: '#f0abfc',
        description: 'Designated area for event judges',
        descriptionVi: 'Khu vực làm việc của ban giám khảo'
    },
    {
        id: '15',
        category: 'EVENT TENT',
        name: 'Interview Room',
        nameVi: 'Phòng Phỏng vấn',
        x: 48, y: 80, width: 6, height: 9.5,
        points: [[20, 0], [100, 0], [100, 100], [0, 80]], // Irregular shape
        color: '#78350f',
        description: 'Quiet room for judge interviews',
        descriptionVi: 'Phòng phỏng vấn riêng với giám khảo'
    },

    // --- OTHERS ---
    {
        id: '16',
        category: 'OTHERS',
        name: 'Judge Waiting Room',
        nameVi: 'Phòng chờ Giám khảo',
        x: 65, y: 85, width: 4.5, height: 5,
        color: '#9333ea',
        description: 'Lounge for official judges',
        descriptionVi: 'Khu vực nghỉ ngơi của giám khảo'
    },
    {
        id: '17',
        category: 'OTHERS',
        name: 'Volunteer Room',
        nameVi: 'Phòng Tình nguyện viên',
        x: 71, y: 78, width: 1.5, height: 4.5, // Shifted left to align with blue boxes
        color: '#3b82f6',
        description: 'Room for event volunteers',
        descriptionVi: 'Phòng dành cho tình nguyện viên'
    },
    {
        id: '18',
        category: 'OTHERS',
        name: 'Checkin Area',
        nameVi: 'Khu vực Check-in',
        x: 63.5, y: 87, width: 1.5, height: 2.5,
        color: '#ffffff',
        description: 'Event registration and check-in',
        descriptionVi: 'Khu vực đăng ký và ghi danh'
    },
    {
        id: '19',
        category: 'OTHERS',
        name: 'Entrance',
        nameVi: 'Lối vào',
        x: 56.5, y: 90, width: 6, height: 5,
        color: '#ef4444',
        description: 'Primary event entrance points',
        descriptionVi: 'Các cổng vào khu vực sự kiện'
    },
    {
        id: '20',
        category: 'OTHERS',
        name: 'Out of Scope',
        nameVi: 'Khu vực ngoài phạm vi',
        x: 50.5, y: 50, width: 18, height: 14,
        points: [[0, 0], [100, 0], [100, 100], [80, 100], [0, 60]],
        color: '#4b5563',
        description: 'Restricted or non-event areas',
        descriptionVi: 'Khu vực không thuộc sự kiện'
    },

    // --- PARKING ---
    {
        id: 'parking_west',
        category: 'PARKING',
        name: 'Parking Space (West)',
        nameVi: 'Bãi đỗ xe (Phía Tây)',
        x: 23, y: 20, width: 18, height: 45,
        points: [[20, 0], [100, 0], [80, 100], [0, 95]], // Slanted
        color: '#000000',
        description: 'Main parking area near Entrance C',
        descriptionVi: 'Bãi đỗ xe chính gần Cổng C'
    },
    {
        id: 'parking_east',
        category: 'PARKING',
        name: 'Parking Space (East)',
        nameVi: 'Bãi đỗ xe (Phía Đông)',
        x: 77.5, y: 20, width: 20, height: 45,
        points: [[0, 0], [80, 5], [100, 100], [20, 100]], // Slanted
        color: '#000000',
        description: 'Main parking area near Entrance B',
        descriptionVi: 'Bãi đỗ xe chính gần Cổng B'
    }
];
